import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";
const JWT_EXPIRES_IN = parseInt(process.env.JWT_EXPIRES_IN || "604800"); // 7 days in seconds

export async function register(req, res) {
  try {
    const { name, firstName, lastName, email, phone, city, password } = req.body;
    const finalName = name || (firstName ? `${firstName} ${lastName || ""}`.trim() : "");
    if (!finalName || !email || !phone || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const existing = await User.findOne({ $or: [{ email }, { phone }] });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      name: finalName,
      firstName: firstName || finalName.split(" ")[0] || "",
      lastName: lastName || finalName.split(" ").slice(1).join(" ") || "",
      email,
      phone,
      city: city || "Gurugram",
      passwordHash,
    });
    await user.save();

    const token = jwt.sign({ sub: user._id, roles: user.roles }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    res.json({
      user: {
        id: user._id,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        city: user.city,
        roles: user.roles,
      },
      token,
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
}

export async function login(req, res) {
  try {
    const { email, phone, password } = req.body;
    if ((!email && !phone) || !password)
      return res.status(400).json({ message: "Missing credentials" });

    const query = email ? { email } : { phone };
    const user = await User.findOne(query);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // Handle users that might have password stored differently (legacy)
    const hashToCompare = user.passwordHash || user.password;
    if (!hashToCompare) {
      return res
        .status(401)
        .json({
          message: "Account needs password reset. Please register again.",
        });
    }

    const valid = await bcrypt.compare(password, hashToCompare);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { sub: user._id, roles: user.roles || ["customer"] },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        roles: user.roles || ["customer"],
      },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
}

export async function me(req, res) {
  try {
    const user = await User.findById(req.user.sub).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Me error:", err);
    res.status(500).json({ message: "Failed to get user" });
  }
}

export async function updateProfile(req, res) {
  try {
    const { name, firstName, lastName, city, addresses } = req.body;
    const user = await User.findById(req.user.sub);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (name) user.name = name;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (city) user.city = city;
    if (addresses) user.addresses = addresses;
    await user.save();
    const updated = await User.findById(req.user.sub).select("-passwordHash");
    res.json(updated);
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
}

// Google / Firebase OAuth Login
export async function googleLogin(req, res) {
  try {
    const { email, name, firstName, lastName, photoURL, phone, googleId } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required for Google Sign-In" });
    }

    let user = await User.findOne({ email });
    if (!user) {
      const finalName = name || (firstName ? `${firstName} ${lastName || ""}`.trim() : "Google User");
      // Generate guaranteed unique 10-digit phone if not provided by Google
      const randomPhone = phone || `9${Math.floor(100000000 + Math.random() * 900000000)}`;
      const passwordHash = await bcrypt.hash(`oauth_${Date.now()}_${Math.random()}`, 10);

      user = new User({
        name: finalName,
        firstName: firstName || finalName.split(" ")[0] || "",
        lastName: lastName || finalName.split(" ").slice(1).join(" ") || "",
        email,
        phone: randomPhone,
        city: "Gurugram",
        passwordHash,
        roles: ["customer"],
      });
      await user.save();
    }

    const token = jwt.sign(
      { sub: user._id, roles: user.roles || ["customer"] },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      user: {
        id: user._id,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        city: user.city,
        roles: user.roles || ["customer"],
      },
      token,
    });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(500).json({ message: "Google authentication failed" });
  }
}

export async function logout(req, res) {
  res.json({ message: "Logged out successfully" });
}

export async function listUsers(req, res) {
  try {
    const users = await User.find().select("-passwordHash").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to list users" });
  }
}

export async function toggleBlockUser(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`, isBlocked: user.isBlocked });
  } catch (err) {
    res.status(500).json({ message: "Failed to update user status" });
  }
}

export async function adjustWallet(req, res) {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.walletBalance = (user.walletBalance || 0) + Number(amount || 0);
    await user.save();
    res.json({ message: "Wallet adjusted", walletBalance: user.walletBalance });
  } catch (err) {
    res.status(500).json({ message: "Failed to adjust wallet" });
  }
}

