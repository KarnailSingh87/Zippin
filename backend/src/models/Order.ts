import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: String,
  qty: Number,
  price: Number,
  mrp: Number,
  unit: String,
  image: String
});

const StatusHistorySchema = new mongoose.Schema({
  status: String,
  timestamp: { type: Date, default: Date.now },
  note: String
});

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [ItemSchema],
  subtotal: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  status: {
    type: String,
    default: 'placed',
    enum: ['placed', 'confirmed', 'picking', 'out_for_delivery', 'delivered', 'cancelled']
  },
  statusHistory: [StatusHistorySchema],
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
  rider: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deliveryAddress: {
    label: String,
    street: String,
    city: String,
    pincode: String,
    lat: Number,
    lng: Number
  },
  payment: {
    method: { type: String, default: 'cod' },
    status: { type: String, default: 'pending' },
    transactionId: String
  },
  couponCode: String,
  estimatedDelivery: Date,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Order', OrderSchema);
