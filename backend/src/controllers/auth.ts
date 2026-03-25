import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const JWT_EXPIRES_IN = parseInt(process.env.JWT_EXPIRES_IN || '604800'); // 7 days in seconds

export async function register(req: Request, res: Response) {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const existing = await User.findOne({ $or: [{ email }, { phone }] });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, phone, passwordHash });
    await user.save();

    const token = jwt.sign({ sub: user._id, roles: user.roles }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.json({ user: { id: user._id, name: user.name, email: user.email, phone: user.phone, roles: user.roles }, token });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Registration failed' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, phone, password } = req.body;
    if ((!email && !phone) || !password) return res.status(400).json({ message: 'Missing credentials' });

    const query = email ? { email } : { phone };
    const user = await User.findOne(query);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    // Handle users that might have password stored differently (legacy)
    const hashToCompare = user.passwordHash || (user as any).password;
    if (!hashToCompare) {
      return res.status(401).json({ message: 'Account needs password reset. Please register again.' });
    }

    const valid = await bcrypt.compare(password, hashToCompare);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ sub: user._id, roles: user.roles || ['customer'] }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.json({ user: { id: user._id, name: user.name, email: user.email, phone: user.phone, roles: user.roles || ['customer'] }, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed' });
  }
}

export async function me(req: any, res: Response) {
  try {
    const user = await User.findById(req.user.sub).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Me error:', err);
    res.status(500).json({ message: 'Failed to get user' });
  }
}

export async function updateProfile(req: any, res: Response) {
  try {
    const { name, addresses } = req.body;
    const user = await User.findById(req.user.sub);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (name) user.name = name;
    if (addresses) user.addresses = addresses;
    await user.save();
    const updated = await User.findById(req.user.sub).select('-passwordHash');
    res.json(updated);
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
}
