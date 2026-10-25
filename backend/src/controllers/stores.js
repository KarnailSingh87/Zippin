import Store from "../models/Store.js";
import Product from "../models/Product.js";

// List all stores
export async function listStores(req, res) {
  try {
    const { city, active } = req.query;
    const filter = {};
    if (city) filter.city = new RegExp(city, "i");
    if (active !== undefined) filter.isActive = active === "true";

    const stores = await Store.find(filter).sort({ createdAt: -1 });
    res.json(stores);
  } catch (err) {
    console.error("List stores error:", err);
    res.status(500).json({ message: "Failed to list stores" });
  }
}

// Get single store with summary
export async function getStore(req, res) {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ message: "Store not found" });

    const productCount = await Product.countDocuments({ storeId: store._id });
    res.json({
      ...store.toJSON(),
      productCount,
    });
  } catch (err) {
    console.error("Get store error:", err);
    res.status(500).json({ message: "Failed to get store" });
  }
}

// Create new store (Admin)
export async function createStore(req, res) {
  try {
    const { name, code, city, area, address, pincode, phone, isActive } = req.body;
    if (!name || !code || !city || !area) {
      return res.status(400).json({ message: "Name, Code, City, and Area are required" });
    }

    const existing = await Store.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({ message: "Store code already in use" });
    }

    const store = new Store({
      name,
      code: code.toUpperCase(),
      city,
      area,
      address: address || "",
      pincode: pincode || "",
      phone: phone || "",
      isActive: isActive !== undefined ? isActive : true,
    });

    await store.save();
    res.status(201).json(store);
  } catch (err) {
    console.error("Create store error:", err);
    res.status(500).json({ message: "Failed to create store" });
  }
}

// Update store (Admin)
export async function updateStore(req, res) {
  try {
    const store = await Store.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!store) return res.status(404).json({ message: "Store not found" });
    res.json(store);
  } catch (err) {
    console.error("Update store error:", err);
    res.status(500).json({ message: "Failed to update store" });
  }
}

// Delete store (Admin)
export async function deleteStore(req, res) {
  try {
    const store = await Store.findByIdAndDelete(req.params.id);
    if (!store) return res.status(404).json({ message: "Store not found" });
    res.json({ message: "Store deleted successfully" });
  } catch (err) {
    console.error("Delete store error:", err);
    res.status(500).json({ message: "Failed to delete store" });
  }
}
