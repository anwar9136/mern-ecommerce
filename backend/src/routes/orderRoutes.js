import express from "express";
const router = express.Router();
import * as orderController from "../controllers/orderController.js";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";

router.use(authMiddleware);

router.post("/create", orderController.createOrder);
router.post("/verify", orderController.verifyPayment);
router.get("/", orderController.getOrders);

// Admin only: Get all orders
router.get("/all", adminMiddleware, orderController.getAllOrders);

export default router;
