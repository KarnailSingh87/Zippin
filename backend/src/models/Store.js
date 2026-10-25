import mongoose from "mongoose";

const StoreSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  city: { type: String, required: true, trim: true },
  area: { type: String, required: true, trim: true },
  address: { type: String, default: "" },
  pincode: { type: String, default: "" },
  phone: { type: String, default: "" },
  deliveryRadiusKm: { type: Number, default: 3.5 },
  surgeMultiplier: { type: Number, default: 1.0 },
  coordinates: {
    lat: { type: Number, default: 28.4595 },
    lng: { type: Number, default: 77.0266 },
  },
  geofencePolygon: [
    {
      lat: Number,
      lng: Number,
    },
  ],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

// Alias for ER model compatibility
StoreSchema.virtual("store_name").get(function () {
  return this.name;
});

StoreSchema.set("toJSON", { virtuals: true });
StoreSchema.set("toObject", { virtuals: true });

export default mongoose.model("Store", StoreSchema);
