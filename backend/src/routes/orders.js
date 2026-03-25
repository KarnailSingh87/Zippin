import { Router } from "express";
import {
  placeOrder,
  listOrders,
  getOrder,
  updateOrderStatus,
  listAllOrders,
} from "../controllers/orders.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();
router.post("/", authenticate, placeOrder);
router.get("/", authenticate, listOrders);
router.get("/all", authenticate, requireAdmin, listAllOrders);
router.get("/:id", authenticate, getOrder);
router.patch("/:id/status", authenticate, requireAdmin, updateOrderStatus);

export default router;
