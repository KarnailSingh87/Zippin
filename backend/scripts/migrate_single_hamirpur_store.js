import mongoose from "mongoose";

const MONGO_URI = "mongodb://127.0.0.1:27017/blinkit";

async function migrate() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB for Hamirpur Single Store Migration...");

  const db = mongoose.connection.db;
  const Store = mongoose.model("Store", new mongoose.Schema({}, { strict: false }));
  const Product = mongoose.model("Product", new mongoose.Schema({}, { strict: false }));
  const Inventory = mongoose.model("Inventory", new mongoose.Schema({}, { strict: false }));
  const DeliveryPartner = mongoose.model("DeliveryPartner", new mongoose.Schema({}, { strict: false }));

  // 1. Find or create Hamirpur store
  let hamirpurStore = await Store.findOne({
    $or: [{ code: "STR-HMR-501" }, { city: "Hamirpur" }],
  });

  if (!hamirpurStore) {
    hamirpurStore = await Store.create({
      code: "STR-HMR-501",
      name: "Zippin Dark Store - Hamirpur District Hub",
      address: "Near Main Bus Stand & Gandhi Chowk, Hamirpur",
      area: "Gandhi Chowk / District Center",
      city: "Hamirpur",
      state: "Himachal Pradesh",
      pincode: "177001",
      phone: "+91 98110 09911",
      email: "store.hamirpur@zippin.in",
      managerName: "Thakur Rajesh Singh",
      operatingHours: "06:00 AM - 02:00 AM",
      deliveryRadiusKm: 15.0,
      totalOrdersServed: 1250,
      capacityUnits: 15000,
      currentUtilization: 65,
      surgeMultiplier: 1.0,
      coordinates: { lat: 31.6862, lng: 76.5213 },
      geofencePolygon: [
        [76.51, 31.67],
        [76.53, 31.67],
        [76.54, 31.70],
        [76.51, 31.70],
        [76.51, 31.67],
      ],
      isActive: true,
    });
    console.log("Created Hamirpur store:", hamirpurStore._id);
  } else {
    hamirpurStore.name = "Zippin Dark Store - Hamirpur District Hub";
    hamirpurStore.address = "Near Main Bus Stand & Gandhi Chowk, Hamirpur";
    hamirpurStore.area = "Gandhi Chowk / District Center";
    hamirpurStore.city = "Hamirpur";
    hamirpurStore.state = "Himachal Pradesh";
    hamirpurStore.pincode = "177001";
    hamirpurStore.deliveryRadiusKm = 15.0;
    hamirpurStore.surgeMultiplier = 1.0;
    hamirpurStore.coordinates = { lat: 31.6862, lng: 76.5213 };
    hamirpurStore.isActive = true;
    hamirpurStore.geofencePolygon = [
      [76.51, 31.67],
      [76.53, 31.67],
      [76.54, 31.70],
      [76.51, 31.70],
      [76.51, 31.67],
    ];
    await hamirpurStore.save();
    console.log("Updated Hamirpur store:", hamirpurStore._id);
  }

  // 2. Delete all other stores - ONLY Hamirpur store remains
  const deletedStores = await Store.deleteMany({ _id: { $ne: hamirpurStore._id } });
  console.log(`Deleted ${deletedStores.deletedCount} non-Hamirpur stores. Single store left.`);

  // Verify only 1 store exists
  const remainingStores = await Store.find({}).lean();
  console.log(`Total stores remaining: ${remainingStores.length} (${remainingStores[0].name}, ${remainingStores[0].city})`);

  // 3. Map all 85 Products to Hamirpur store
  const prodUpdateResult = await Product.updateMany(
    {},
    { $set: { storeId: hamirpurStore._id } }
  );
  console.log(`Updated ${prodUpdateResult.modifiedCount} products to Hamirpur store ID.`);

  // 4. Update Inventory: Remove stale inventories, ensure all products exist in Hamirpur store
  await Inventory.deleteMany({ store: { $ne: hamirpurStore._id } });
  
  const allProducts = await Product.find({}).lean();
  console.log(`Ensuring inventory for all ${allProducts.length} products in Hamirpur store...`);
  
  for (const prod of allProducts) {
    await Inventory.findOneAndUpdate(
      { store: hamirpurStore._id, product: prod._id },
      {
        store: hamirpurStore._id,
        product: prod._id,
        stock: prod.stock || 75,
        isAvailable: true,
      },
      { upsert: true, new: true }
    );
  }
  const hamirpurInvCount = await Inventory.countDocuments({ store: hamirpurStore._id });
  console.log(`Hamirpur store now has ${hamirpurInvCount} inventory records.`);

  // 5. Update Delivery Partners to Hamirpur
  const partnersUpdated = await DeliveryPartner.updateMany(
    {},
    {
      $set: {
        city: "Hamirpur",
        status: "available",
        isActive: true,
      },
    }
  );
  console.log(`Updated ${partnersUpdated.modifiedCount} delivery partners to Hamirpur zone.`);

  console.log("\n=== MIGRATION TO HAMIRPUR SINGLE STORE COMPLETED SUCCESSFULLY ===");
  await mongoose.disconnect();
}

migrate().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
