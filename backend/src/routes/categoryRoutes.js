import express from "express";
const router = express.Router();
import { getCategories, createCategory, updateCategory, deleteCategory } from "../controllers/categoryController.js";
import upload from "../middleware/upload.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

router.get("/", getCategories);
router.post("/", authMiddleware, adminMiddleware, upload.single("image"), createCategory);
router.put("/:id", authMiddleware, adminMiddleware, upload.single("image"), updateCategory);
router.delete("/:id", authMiddleware, adminMiddleware, deleteCategory);

export default router;
