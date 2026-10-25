import DeliveryPartner from "../models/DeliveryPartner.js";
import Delivery from "../models/Delivery.js";

// List delivery partners (riders and pickers)
export async function listPartners(req, res) {
  try {
    const { status, city, active, role } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (city) filter.city = new RegExp(city, "i");
    if (active !== undefined) filter.isActive = active === "true";
    if (role) {
      if (role === "rider") {
        filter.$or = [{ role: "rider" }, { role: { $exists: false } }, { role: null }];
      } else {
        filter.role = role;
      }
    }

    const partners = await DeliveryPartner.find(filter)
      .populate("currentStore", "name city area")
      .sort({ createdAt: -1 });

    res.json(partners);
  } catch (err) {
    console.error("List delivery partners error:", err);
    res.status(500).json({ message: "Failed to list delivery partners" });
  }
}

// Get single partner
export async function getPartner(req, res) {
  try {
    const partner = await DeliveryPartner.findById(req.params.id).populate(
      "currentStore",
      "name city area"
    );
    if (!partner) return res.status(404).json({ message: "Staff partner not found" });

    const activeDeliveries = await Delivery.find({
      partner: partner._id,
      status: { $in: ["assigned", "picking", "out_for_delivery"] },
    }).populate("order");

    res.json({
      ...partner.toJSON(),
      activeDeliveries,
    });
  } catch (err) {
    console.error("Get delivery partner error:", err);
    res.status(500).json({ message: "Failed to get delivery partner" });
  }
}

// Create partner (Admin)
export async function createPartner(req, res) {
  try {
    const {
      firstName,
      lastName,
      phone,
      email,
      city,
      role,
      status,
      vehicleType,
      vehicleNumber,
      shift,
      pickingSpeedSec,
      totalOrdersPacked,
      currentStore,
    } = req.body;

    if (!firstName || !phone || !city) {
      return res.status(400).json({ message: "First name, phone, and city are required" });
    }

    const existing = await DeliveryPartner.findOne({ phone });
    if (existing) {
      return res.status(400).json({ message: "Phone number already registered" });
    }

    const partner = new DeliveryPartner({
      firstName,
      lastName: lastName || "",
      phone,
      email: email || "",
      city,
      role: role || "rider",
      status: status || "available",
      vehicleType: role === "picker" ? "None (In-Store Picker)" : (vehicleType || "Bike"),
      vehicleNumber: role === "picker" ? "" : (vehicleNumber || ""),
      shift: shift || "Morning",
      pickingSpeedSec: Number(pickingSpeedSec) || 95,
      totalOrdersPacked: Number(totalOrdersPacked) || 0,
      currentStore: currentStore || null,
    });

    await partner.save();
    res.status(201).json(partner);
  } catch (err) {
    console.error("Create delivery partner error:", err);
    res.status(500).json({ message: "Failed to create delivery partner" });
  }
}

// Update partner (Admin)
export async function updatePartner(req, res) {
  try {
    const partner = await DeliveryPartner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!partner) return res.status(404).json({ message: "Delivery partner not found" });
    res.json(partner);
  } catch (err) {
    console.error("Update delivery partner error:", err);
    res.status(500).json({ message: "Failed to update delivery partner" });
  }
}

// Update partner status (available / busy / offline)
export async function updatePartnerStatus(req, res) {
  try {
    const { status } = req.body;
    if (!["available", "busy", "offline"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const partner = await DeliveryPartner.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!partner) return res.status(404).json({ message: "Delivery partner not found" });
    res.json(partner);
  } catch (err) {
    console.error("Update partner status error:", err);
    res.status(500).json({ message: "Failed to update partner status" });
  }
}

// Delete partner (Admin)
export async function deletePartner(req, res) {
  try {
    const partner = await DeliveryPartner.findByIdAndDelete(req.params.id);
    if (!partner) return res.status(404).json({ message: "Delivery partner not found" });
    res.json({ message: "Delivery partner deleted successfully" });
  } catch (err) {
    console.error("Delete delivery partner error:", err);
    res.status(500).json({ message: "Failed to delete delivery partner" });
  }
}
