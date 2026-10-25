import { Router } from "express";
import {
  listPayments,
  getPayment,
  getPaymentByOrder,
  updatePaymentStatus,
} from "../controllers/payments.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticate, requireAdmin, listPayments);
router.get("/order/:orderId", authenticate, getPaymentByOrder);
router.get("/:id", authenticate, getPayment);
router.patch("/:id/status", authenticate, requireAdmin, updatePaymentStatus);

export default router;
