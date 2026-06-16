import express from "express";
const router = express.Router();
import { getProducts, getProductBySlug, createProduct, updateProduct, deleteProduct } from "../controllers/productController.js";
import upload from "../middleware/upload.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

router.get("/", getProducts);
router.get("/:slug", getProductBySlug);
router.post("/", authMiddleware, adminMiddleware, upload.array("images", 8), createProduct);
router.put("/:id", authMiddleware, adminMiddleware, upload.array("images", 8), updateProduct);
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

export default router;
