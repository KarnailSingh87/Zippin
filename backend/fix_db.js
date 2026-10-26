require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function fix() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');
  const db = mongoose.connection.db;

  // Fix the admin user - set roles and password
  const adminHash = await bcrypt.hash('ZippinAdmin@2026', 10);
  await db.collection('users').updateOne(
    { email: 'admin@zippin.in' },
    { $set: { roles: ['admin'], passwordHash: adminHash } },
    { upsert: true }
  );
  console.log('Fixed admin user (admin@zippin.in)');

  // Fix demo customer
  const demoHash = await bcrypt.hash('demo123', 10);
  await db.collection('users').updateOne(
    { email: 'demo@zippin.in' },
    { $set: { passwordHash: demoHash, roles: ['customer'] } },
    { upsert: true }
  );
  console.log('Fixed demo user (demo@zippin.in)');

  // Fix any products that don't have images
  const productsWithoutImages = await db.collection('products').find({
    $or: [{ images: { $size: 0 } }, { images: null }, { images: { $exists: false } }]
  }).toArray();
  
  for (const p of productsWithoutImages) {
    const word = (p.title || 'Product').split(' ')[0];
    await db.collection('products').updateOne(
      { _id: p._id },
      { $set: { images: [{ url: `https://placehold.co/300x300/E8F5E9/333?text=${encodeURIComponent(word)}`, publicId: '' }] } }
    );
  }
  console.log(`Fixed ${productsWithoutImages.length} products without images`);

  // Verify all users
  const users = await db.collection('users').find({}).project({ name: 1, email: 1, roles: 1 }).toArray();
  console.log('\n=== All Users ===');
  users.forEach(u => console.log(`  ${u.name || 'User'} | ${u.email} | roles: ${JSON.stringify(u.roles)}`));

  await mongoose.disconnect();
  console.log('\nDone!');
}

fix().catch(e => { console.error(e); process.exit(1); });
