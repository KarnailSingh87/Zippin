import mongoose from "mongoose";

async function run() {
  await mongoose.connect("mongodb://localhost:27017/zippin");
  const db = mongoose.connection.collection("deliverypartners");
  const stores = await mongoose.connection.collection("stores").find({}).toArray();
  const storeIds = stores.map((s) => s._id);

  // Set role: 'rider' on all existing partners where role is not set
  await db.updateMany({ role: { $exists: false } }, { $set: { role: "rider" } });

  const existingPickers = await db.countDocuments({ role: "picker" });
  if (existingPickers === 0) {
    const samplePickers = [
      {
        partnerId: "PCK-GUR-101",
        firstName: "Sanjay",
        lastName: "Kumar",
        name: "Sanjay Kumar",
        phone: "+91 98110 54001",
        email: "sanjay.k@zippin.internal",
        city: "Gurugram",
        role: "picker",
        status: "busy",
        shift: "Morning",
        pickingSpeedSec: 82,
        totalOrdersPacked: 842,
        vehicleType: "None (In-Store Picker)",
        rating: 4.95,
        currentStore: storeIds[0] || null,
        isActive: true,
        createdAt: new Date(),
      },
      {
        partnerId: "PCK-GUR-102",
        firstName: "Pooja",
        lastName: "Sharma",
        name: "Pooja Sharma",
        phone: "+91 98110 54002",
        email: "pooja.s@zippin.internal",
        city: "Gurugram",
        role: "picker",
        status: "available",
        shift: "Morning",
        pickingSpeedSec: 76,
        totalOrdersPacked: 1240,
        vehicleType: "None (In-Store Picker)",
        rating: 4.98,
        currentStore: storeIds[0] || null,
        isActive: true,
        createdAt: new Date(),
      },
      {
        partnerId: "PCK-GUR-103",
        firstName: "Vikrant",
        lastName: "Mehra",
        name: "Vikrant Mehra",
        phone: "+91 98110 54003",
        email: "vikrant.m@zippin.internal",
        city: "Gurugram",
        role: "picker",
        status: "available",
        shift: "Evening",
        pickingSpeedSec: 89,
        totalOrdersPacked: 610,
        vehicleType: "None (In-Store Picker)",
        rating: 4.88,
        currentStore: storeIds[1] || storeIds[0] || null,
        isActive: true,
        createdAt: new Date(),
      },
      {
        partnerId: "PCK-DEL-201",
        firstName: "Manish",
        lastName: "Tiwari",
        name: "Manish Tiwari",
        phone: "+91 98110 54004",
        email: "manish.t@zippin.internal",
        city: "New Delhi",
        role: "picker",
        status: "available",
        shift: "Morning",
        pickingSpeedSec: 92,
        totalOrdersPacked: 495,
        vehicleType: "None (In-Store Picker)",
        rating: 4.90,
        currentStore: storeIds[2] || storeIds[0] || null,
        isActive: true,
        createdAt: new Date(),
      },
      {
        partnerId: "PCK-NOI-301",
        firstName: "Anjali",
        lastName: "Gupta",
        name: "Anjali Gupta",
        phone: "+91 98110 54005",
        email: "anjali.g@zippin.internal",
        city: "Noida",
        role: "picker",
        status: "busy",
        shift: "Morning",
        pickingSpeedSec: 79,
        totalOrdersPacked: 980,
        vehicleType: "None (In-Store Picker)",
        rating: 4.96,
        currentStore: storeIds[3] || storeIds[0] || null,
        isActive: true,
        createdAt: new Date(),
      },
      {
        partnerId: "PCK-BLR-401",
        firstName: "Karthik",
        lastName: "Rao",
        name: "Karthik Rao",
        phone: "+91 98110 54006",
        email: "karthik.r@zippin.internal",
        city: "Bengaluru",
        role: "picker",
        status: "available",
        shift: "Evening",
        pickingSpeedSec: 85,
        totalOrdersPacked: 730,
        vehicleType: "None (In-Store Picker)",
        rating: 4.92,
        currentStore: storeIds[4] || storeIds[0] || null,
        isActive: true,
        createdAt: new Date(),
      },
    ];
    await db.insertMany(samplePickers);
    console.log("Seeded 6 pickers successfully!");
  }

  const finalRiders = await db.countDocuments({ role: "rider" });
  const finalPickers = await db.countDocuments({ role: "picker" });
  console.log("Final counts - Riders:", finalRiders, "Pickers:", finalPickers);
  await mongoose.disconnect();
}

run().catch(console.error);
