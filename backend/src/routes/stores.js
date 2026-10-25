import { Router } from "express";
import {
  listStores,
  getStore,
  createStore,
  updateStore,
  deleteStore,
} from "../controllers/stores.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", listStores);
router.get("/:id", getStore);
router.post("/", authenticate, requireAdmin, createStore);
router.put("/:id", authenticate, requireAdmin, updateStore);
router.delete("/:id", authenticate, requireAdmin, deleteStore);

export default router;
