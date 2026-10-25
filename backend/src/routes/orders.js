import { Router } from "express";
import {
  placeOrder,
  listOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder,
  listAllOrders,
  assignPartner,
  assignPicker,
  assignPartnerToOrder,
  assignStoreToOrder,
  assignPickerToOrder,
  updateOrderAddress,
  handleMissingItems,
} from "../controllers/orders.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();
router.post("/", authenticate, placeOrder);
router.get("/", authenticate, listOrders);
router.get("/all", authenticate, requireAdmin, listAllOrders);
router.get("/:id", authenticate, getOrder);
router.post("/:id/cancel", authenticate, cancelOrder);
router.patch("/:id/status", authenticate, updateOrderStatus);
router.patch("/:id/assign", authenticate, requireAdmin, assignPartnerToOrder || assignPartner);
router.patch("/:id/assign-partner", authenticate, requireAdmin, assignPartner);
router.patch("/:id/assign-store", authenticate, requireAdmin, assignStoreToOrder);
router.patch("/:id/assign-picker", authenticate, requireAdmin, assignPicker);
router.patch("/:id/address", authenticate, updateOrderAddress);
router.patch("/:id/items", authenticate, requireAdmin, handleMissingItems);

export default router;
