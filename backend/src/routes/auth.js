import { Router } from "express";
import {
  register,
  login,
  googleLogin,
  me,
  updateProfile,
  logout,
  sendOtp,
  verifyOtp,
  refreshToken,
  authRateLimiter,
  listUsers,
  toggleBlockUser,
  adjustWallet,
} from "../controllers/auth.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();
router.post("/register", register);
router.post("/login", authRateLimiter(20, 60000), login);
router.post("/google", googleLogin);
router.post("/otp/send", authRateLimiter(5, 60000), sendOtp);
router.post("/otp/verify", verifyOtp);
router.post("/refresh", refreshToken);
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, me);
router.put("/profile", authenticate, updateProfile);

// Admin Customer Management (CRM)
router.get("/users", authenticate, requireAdmin, listUsers);
router.patch("/users/:id/block", authenticate, requireAdmin, toggleBlockUser);
router.post("/users/:id/wallet", authenticate, requireAdmin, adjustWallet);

export default router;
