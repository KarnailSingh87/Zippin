import { Router } from "express";
import { getUploadSignature } from "../controllers/uploads.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();
router.get("/sign", authenticate, getUploadSignature);

export default router;
