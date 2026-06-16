import mongoose from "mongoose";
import Product from "./src/models/Product.js";
import "dotenv/config";

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const count = await Product.countDocuments();
        const products = await Product.find().limit(5);
        console.log(`TOTAL_PRODUCTS:${count}`);
        console.log('SAMPLES:', JSON.stringify(products, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
run();
