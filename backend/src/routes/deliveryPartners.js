import { Router } from "express";
import {
  listPartners,
  getPartner,
  createPartner,
  updatePartner,
  updatePartnerStatus,
  deletePartner,
} from "../controllers/deliveryPartners.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", listPartners);
router.get("/:id", getPartner);
router.post("/", authenticate, requireAdmin, createPartner);
router.put("/:id", authenticate, requireAdmin, updatePartner);
router.patch("/:id/status", authenticate, updatePartnerStatus);
router.delete("/:id", authenticate, requireAdmin, deletePartner);

export default router;
