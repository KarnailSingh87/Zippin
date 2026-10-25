import { Router } from "express";
import {
  listInventory,
  updateInventoryStock,
  getLowStockAlerts,
} from "../controllers/inventory.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticate, listInventory);
router.get("/alerts", authenticate, getLowStockAlerts);
router.post("/", authenticate, requireAdmin, updateInventoryStock);

export default router;
