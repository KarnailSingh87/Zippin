import { Response } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import { AuthRequest } from '../middleware/auth';

export async function placeOrder(req: AuthRequest, res: Response) {
  try {
    const { items, deliveryAddress, payment } = req.body;
    if (!items || !items.length) return res.status(400).json({ message: 'No items' });

    let subtotal = 0;
    const orderItems: any[] = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) continue;
      const qty = item.qty || 1;
      subtotal += product.price * qty;
      orderItems.push({
        product: product._id,
        name: product.title,
        qty,
        price: product.price,
        mrp: product.mrp || product.price,
        unit: product.unit,
        image: product.images?.[0]?.url || ''
      });
    }

    const deliveryFee = subtotal >= 499 ? 0 : 30;
    const total = subtotal + deliveryFee;
    const estimatedDelivery = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const order = new Order({
      user: req.user!.sub,
      items: orderItems,
      subtotal,
      deliveryFee,
      total,
      status: 'placed',
      statusHistory: [{ status: 'placed', timestamp: new Date(), note: 'Order placed successfully' }],
      deliveryAddress: deliveryAddress || {},
      payment: payment || { method: 'cod', status: 'pending' },
      estimatedDelivery
    });

    await order.save();
    res.json(order);
  } catch (err) {
    console.error('Place order error', err);
    res.status(500).json({ message: 'Failed to place order' });
  }
}

export async function listOrders(req: AuthRequest, res: Response) {
  const orders = await Order.find({ user: req.user!.sub }).sort({ createdAt: -1 }).limit(50);
  res.json(orders);
}

export async function getOrder(req: AuthRequest, res: Response) {
  const order = await Order.findById(req.params.id).populate('items.product');
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
}

export async function updateOrderStatus(req: AuthRequest, res: Response) {
  const { status, note } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.status = status;
  order.statusHistory.push({ status, timestamp: new Date(), note: note || '' } as any);
  if (status === 'delivered') {
    (order.payment as any).status = 'completed';
  }
  await order.save();
  res.json(order);
}

export async function listAllOrders(req: AuthRequest, res: Response) {
  const statusFilter = req.query.status ? { status: req.query.status } : {};
  const orders = await Order.find(statusFilter)
    .populate('user', 'name email phone')
    .sort({ createdAt: -1 })
    .limit(100);
  res.json(orders);
}
