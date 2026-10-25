import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
  label: String,
  street: String,
  city: String,
  pincode: String,
  geo: {
    type: [Number], // [lng, lat]
    index: "2dsphere",
  },
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  firstName: { type: String, trim: true, default: "" },
  lastName: { type: String, trim: true, default: "" },
  email: { type: String, required: true, unique: true, index: true },
  phone: { type: String, required: true, unique: true },
  city: { type: String, default: "Gurugram" },
  passwordHash: { type: String, required: true },
  roles: { type: [String], default: ["customer"] },
  addresses: [AddressSchema],
  createdAt: { type: Date, default: Date.now },
});

// Auto-fill firstName & lastName from name if missing
UserSchema.pre("save", function (next) {
  if (this.name && (!this.firstName || !this.lastName)) {
    const parts = this.name.trim().split(" ");
    if (!this.firstName) this.firstName = parts[0] || "";
    if (!this.lastName && parts.length > 1) this.lastName = parts.slice(1).join(" ") || "";
  }
  if (!this.name && this.firstName) {
    this.name = this.lastName ? `${this.firstName} ${this.lastName}`.trim() : this.firstName;
  }
  next();
});

// ER model virtual aliases
UserSchema.virtual("first_name").get(function () {
  return this.firstName || (this.name ? this.name.split(" ")[0] : "");
});
UserSchema.virtual("last_name").get(function () {
  return this.lastName || (this.name ? this.name.split(" ").slice(1).join(" ") : "");
});

UserSchema.set("toJSON", { virtuals: true });
UserSchema.set("toObject", { virtuals: true });

export default mongoose.model("User", UserSchema);
