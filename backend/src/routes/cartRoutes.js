import express from "express";
const router = express.Router();
import * as cartController from "../controllers/cartController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

router.use(authMiddleware);

router.get("/", cartController.getCart);
router.post("/add", cartController.addToCart);
router.put("/update/:productId", cartController.updateQuantity);
router.delete("/remove/:productId", cartController.removeFromCart);
router.delete("/clear", cartController.clearCart);

export default router;
