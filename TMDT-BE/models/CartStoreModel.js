import mongoose from "mongoose";
import CartModel from "./CartModel.js";
import { applyPromotionsToItems } from "../utils/calculateCart.js";

const CartStoreSchema = new mongoose.Schema({
    cart_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart"
    },
    store_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store"
    },
    promotion:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Promotion"
    },
    shippingFee:{
        type: Number,
        required: true,
        default: 0
    },
    subTotal:{
        type: Number,
        default: 0
    },
    finalTotal: {
        type: Number,
        default: 0
    },
    onDeploy: {
        type: Boolean,
        default: true
    }
},{
    timestamps: true
})



CartStoreSchema.pre("save", async function (next) {
    // Nếu chỉ thay đổi promotion hoặc phí ship, ta trigger lại tính toán
    if (this.isModified("promotion") || this.isModified("shippingFee")) {
        await applyPromotionsToItems(this.cart_id, this._id);
    }
    next();
});

const CartStoreModel = mongoose.model("CartStore", CartStoreSchema)
export default CartStoreModel