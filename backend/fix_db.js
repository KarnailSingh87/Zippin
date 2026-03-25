require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function fix() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');
  const db = mongoose.connection.db;

  // Fix the original admin user - set roles and rehash password
  const adminHash = await bcrypt.hash('K@rnail0011', 10);
  await db.collection('users').updateOne(
    { email: 'harshvardhan2005.12.16@gmail.com' },
    { $set: { roles: ['admin'], passwordHash: adminHash } }
  );
  console.log('Fixed original admin user (harshvardhan2005.12.16@gmail.com)');

  // Create or fix admin@blinkit.com
  const blinkitAdminHash = await bcrypt.hash('admin123', 10);
  const exists = await db.collection('users').findOne({ email: 'admin@blinkit.com' });
  if (!exists) {
    await db.collection('users').insertOne({
      name: 'Admin',
      email: 'admin@blinkit.com',
      phone: '1111111111',
      passwordHash: blinkitAdminHash,
      roles: ['admin'],
      addresses: [],
      createdAt: new Date()
    });
    console.log('Created admin@blinkit.com');
  } else {
    await db.collection('users').updateOne(
      { email: 'admin@blinkit.com' },
      { $set: { roles: ['admin'], passwordHash: blinkitAdminHash } }
    );
    console.log('Fixed admin@blinkit.com');
  }

  // Fix demo user
  const demoHash = await bcrypt.hash('demo123', 10);
  await db.collection('users').updateOne(
    { email: 'demo@blinkit.com' },
    { $set: { passwordHash: demoHash, roles: ['customer'] } }
  );
  console.log('Fixed demo user');

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
  users.forEach(u => console.log(`  ${u.name} | ${u.email} | roles: ${JSON.stringify(u.roles)}`));

  await mongoose.disconnect();
  console.log('\nDone!');
}

fix().catch(e => { console.error(e); process.exit(1); });
