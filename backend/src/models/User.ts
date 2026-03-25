import mongoose from 'mongoose';

const AddressSchema = new mongoose.Schema({
  label: String,
  street: String,
  city: String,
  pincode: String,
  geo: {
    type: [Number], // [lng, lat]
    index: '2dsphere'
  }
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  phone: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  roles: { type: [String], default: ['customer'] },
  addresses: [AddressSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', UserSchema);
