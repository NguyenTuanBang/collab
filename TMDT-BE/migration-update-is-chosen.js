import dotenv from "dotenv";
import mongoose from "mongoose";
import CartItemModel from "./models/CartItemModel.js";

dotenv.config({ path: "./config.env" });

const DB = process.env.DB.replace("<PASSWORD>", process.env.DB_PASSWORD);

async function migrate() {
    try {
        await mongoose.connect(DB, {});
        console.log("✅ MongoDB connected");

        // Update tất cả items có is_chosen = false thành true
        const result = await CartItemModel.updateMany(
            { is_chosen: false },
            { $set: { is_chosen: true } }
        );

        console.log("✅ Updated items:", result.modifiedCount);
        
        await mongoose.disconnect();
        console.log("✅ Migration completed!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Migration error:", err);
        process.exit(1);
    }
}

migrate();
