import { Router } from "express";
import { getUploadSignature } from "../controllers/uploads.js";

const router = Router();
router.get("/sign", getUploadSignature);

export default router;
