import { Router } from "express";
import auth from "./auth.js";
import uploads from "./uploads.js";
import products from "./products.js";
import categories from "./categories.js";
import orders from "./orders.js";
import stores from "./stores.js";
import deliveryPartners from "./deliveryPartners.js";
import payments from "./payments.js";
import inventory from "./inventory.js";
import deliveries from "./deliveries.js";
import internal from "./internal.js";

const router = Router();
router.use("/auth", auth);
router.use("/uploads", uploads);
router.use("/products", products);
router.use("/categories", categories);
router.use("/orders", orders);
router.use("/stores", stores);
router.use("/delivery-partners", deliveryPartners);
router.use("/payments", payments);
router.use("/inventory", inventory);
router.use("/deliveries", deliveries);
router.use("/internal", internal);

export default router;
