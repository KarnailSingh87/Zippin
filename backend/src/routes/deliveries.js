import { Router } from "express";
import {
  listDeliveries,
  getDeliveryByOrder,
  assignDeliveryPartner,
  updateDeliveryStatus,
  reassignOnBreakdown,
} from "../controllers/deliveries.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticate, requireAdmin, listDeliveries);
router.get("/order/:orderId", authenticate, getDeliveryByOrder);
router.post("/assign", authenticate, requireAdmin, assignDeliveryPartner);
router.patch("/:id/status", authenticate, updateDeliveryStatus);
router.post("/:id/reassign", authenticate, requireAdmin, reassignOnBreakdown);

export default router;
