import Inventory from "../models/Inventory.js";
import Product from "../models/Product.js";

// List inventory for a store
export async function listInventory(req, res) {
  try {
    const { storeId, lowStock } = req.query;
    const filter = {};
    if (storeId) filter.store = storeId;

    let items = await Inventory.find(filter)
      .populate("store", "name code city area")
      .populate("product", "title category price unit stock images isAvailable")
      .sort({ stock: 1 });

    if (lowStock === "true") {
      items = items.filter((item) => item.stock <= item.lowStockThreshold);
    }

    res.json(items);
  } catch (err) {
    console.error("List inventory error:", err);
    res.status(500).json({ message: "Failed to list inventory" });
  }
}

// Update inventory stock (set or delta)
export async function updateInventoryStock(req, res) {
  try {
    const { storeId, productId, stock, lowStockThreshold } = req.body;
    if (!storeId || !productId || stock === undefined) {
      return res.status(400).json({ message: "storeId, productId, and stock are required" });
    }

    const inventory = await Inventory.findOneAndUpdate(
      { store: storeId, product: productId },
      {
        store: storeId,
        product: productId,
        stock: Math.max(0, parseInt(stock)),
        ...(lowStockThreshold !== undefined ? { lowStockThreshold } : {}),
        lastRestockedAt: new Date(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )
      .populate("store", "name code city area")
      .populate("product", "title category price unit stock");

    // Also sync product stock
    await Product.findByIdAndUpdate(productId, { stock: Math.max(0, parseInt(stock)) });

    res.json(inventory);
  } catch (err) {
    console.error("Update inventory error:", err);
    res.status(500).json({ message: "Failed to update inventory" });
  }
}

// Low stock alert summary
export async function getLowStockAlerts(req, res) {
  try {
    const { storeId } = req.query;
    const filter = {};
    if (storeId) filter.store = storeId;

    const all = await Inventory.find(filter)
      .populate("store", "name code")
      .populate("product", "title category price");

    const lowStockItems = all.filter((item) => item.stock <= item.lowStockThreshold);
    res.json({
      count: lowStockItems.length,
      items: lowStockItems,
    });
  } catch (err) {
    console.error("Get low stock alerts error:", err);
    res.status(500).json({ message: "Failed to get alerts" });
  }
}
