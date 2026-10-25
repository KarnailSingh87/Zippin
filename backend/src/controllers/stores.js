import Store from "../models/Store.js";
import Product from "../models/Product.js";
import DeliveryPartner from "../models/DeliveryPartner.js";
import Order from "../models/Order.js";
import Delivery from "../models/Delivery.js";

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

// Get primary store
export async function getPrimaryStore(req, res) {
  try {
    let store = (await Store.findOne({ isActive: true })) || (await Store.findOne({}));
    if (!store) {
      store = await Store.create({
        name: "Zippin Store #501 - Hamirpur Hub",
        code: "STR-HMR-501",
        city: "Hamirpur",
        area: "Hamirpur District Center",
        address: "Main Bazaar, Near Gandhi Chowk",
        pincode: "177001",
        phone: "+91 98110 09911",
        deliveryRadiusKm: 12,
        coordinates: { lat: 31.6862, lng: 76.5213 },
        isActive: true,
      });
    }
    const productCount = await Product.countDocuments({ storeId: store._id });
    res.json({
      ...store.toJSON(),
      productCount,
    });
  } catch (err) {
    console.error("Get primary store error:", err);
    res.status(500).json({ message: "Failed to get primary store" });
  }
}

// Update primary store address and coordinates (Admin)
export async function updatePrimaryStore(req, res) {
  try {
    const { name, address, city, area, pincode, phone, deliveryRadiusKm, coordinates, lat, lng } = req.body;
    let store = (await Store.findOne({ isActive: true })) || (await Store.findOne({}));
    if (!store) {
      store = new Store({
        code: "STR-HMR-501",
        name: name || "Zippin Store #501 - Hamirpur Hub",
        city: city || "Hamirpur",
        area: area || "Hamirpur District Center",
        isActive: true,
      });
    }

    if (name) store.name = name;
    if (address !== undefined) store.address = address;
    if (city !== undefined) store.city = city;
    if (area !== undefined) store.area = area;
    if (pincode !== undefined) store.pincode = pincode;
    if (phone !== undefined) store.phone = phone;
    if (deliveryRadiusKm !== undefined) store.deliveryRadiusKm = Number(deliveryRadiusKm);

    const newLat = lat !== undefined ? Number(lat) : (coordinates?.lat !== undefined ? Number(coordinates.lat) : store.coordinates?.lat);
    const newLng = lng !== undefined ? Number(lng) : (coordinates?.lng !== undefined ? Number(coordinates.lng) : store.coordinates?.lng);

    if (newLat && newLng) {
      store.coordinates = { lat: newLat, lng: newLng };
    }

    await store.save();

    // Sync all active delivery partners and riders origin to this store location
    if (newLat && newLng) {
      await DeliveryPartner.updateMany(
        {},
        {
          $set: {
            currentStore: store._id,
            location: { lat: newLat, lng: newLng },
            city: store.city || "Hamirpur",
          },
        }
      );
      // Link active orders and deliveries to this updated store
      await Order.updateMany(
        { status: { $in: ["placed", "confirmed", "picking"] } },
        { $set: { store: store._id } }
      );
      await Delivery.updateMany(
        { status: { $in: ["assigned", "pending_assignment"] } },
        { $set: { store: store._id } }
      );
    }

    res.json({
      message: "Store address and origin coordinates updated successfully",
      store,
    });
  } catch (err) {
    console.error("Update primary store error:", err);
    res.status(500).json({ message: "Failed to update primary store" });
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
    const { name, code, city, area, address, pincode, phone, isActive, coordinates } = req.body;
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
      coordinates: coordinates || { lat: 31.6862, lng: 76.5213 },
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

    // Sync riders if coordinates updated
    if (req.body.coordinates?.lat && req.body.coordinates?.lng) {
      await DeliveryPartner.updateMany(
        { $or: [{ currentStore: store._id }, { city: store.city }] },
        {
          $set: {
            currentStore: store._id,
            location: { lat: req.body.coordinates.lat, lng: req.body.coordinates.lng },
          },
        }
      );
    }

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
