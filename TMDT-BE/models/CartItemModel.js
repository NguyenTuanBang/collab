import mongoose from "mongoose";
import { applyPromotionsToItems } from "../utils/calculateCart.js";

const cartItemSchema = new mongoose.Schema({
    cartStore_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CartStore',
        required: true
    },
    variant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductVariants',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    unitPrice: {
        type: Number,
    },
    //giá trị sau khi đã giảm hết
    finalPrice: {
        type: Number
    },
    is_chosen: {
        type: Boolean,
        default: false
    },
    is_out_of_stock: {
        type: Boolean,
        default: false
    },
    //giá trị được giảm
    discountValue: { type: Number, default: 0 }
});

// cartItemSchema.pre("save", async function (next) {
//     this.finalPrice = this.unitPrice*this.quantity
//     next()
// });
// cartItemSchema.pre("save", async function(next) {
//     this.finalPrice = this.unitPrice * this.quantity;
//     await updateCartStoreAndCart(this.cartStore_id);
//     next();
// });

// cartItemSchema.pre("deleteOne", { document: true, query: false }, async function(next) {
//     await updateCartStoreAndCart(this.cartStore_id);
//     next();
// });

// // Helper
// async function updateCartStoreAndCart(cartStoreId) {
//     const CartStore = mongoose.model("CartStore");
//     const Cart = mongoose.model("Cart");

//     if (cartStoreId) {
//         const cartStore = await CartStore.findById(cartStoreId);
//         if (cartStore) {
//             await cartStore.save();
//             const cart = await Cart.findById(cartStore.cart_id);
//             if (cart) {
//                 await cart.save();
//             }
//         }
//     }
// }

cartItemSchema.pre("save", async function (next) {
    this.finalPrice = this.unitPrice * this.quantity;
    try {
        const CartStore = mongoose.model("CartStore");
        const store = await CartStore.findById(this.cartStore_id);
        if (store && store.onDeploy === false) {
            store.onDeploy = true;
            await store.save();
        }
        if (store && store.cart_id) {
            await applyPromotionsToItems(store.cart_id, store._id);
        }
    } catch (err) {
        console.error("Lỗi khi cập nhật promotion:", err);
    }
    next();
});
cartItemSchema.pre("updateMany", async function (next) {
    const update = this.getUpdate();

    // Nếu unitPrice hoặc quantity được update thì tính lại finalPrice
    if (update.unitPrice != null || update.quantity != null) {
        update.finalPrice = update.unitPrice * update.quantity;
        this.setUpdate(update); // cập nhật lại cho query
    }

    try {
        // Lấy các document bị ảnh hưởng để áp dụng promotion
        const CartItem = mongoose.model("CartItem");
        const items = await CartItem.find(this.getQuery()); // các item bị update

        const CartStore = mongoose.model("CartStore");
        for (const item of items) {
            const store = await CartStore.findById(item.cartStore_id);
            if (store && store.cart_id) {
                await applyPromotionsToItems(store.cart_id, store._id);
            }
        }
    } catch (err) {
        console.error("Lỗi khi cập nhật promotion:", err);
    }
    next();
});


cartItemSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
    try {
        const CartStore = mongoose.model("CartStore");
        const CartItem = mongoose.model("CartItem");
        const store = await CartStore.findById(this.cartStore_id);

        if (store && store.cart_id) {
            // Kiểm tra còn item nào thuộc store này không
            const remainingItems = await CartItem.countDocuments({
                cartStore_id: store._id,
                is_chosen: true
            });

            if (remainingItems === 0) {
                // Không còn item nào được chọn → store “chết”
                store.onDeploy = false;
                store.subTotal = 0;
                store.finalTotal = 0;
                await store.save({ validateBeforeSave: false });
            }

            // Gọi lại logic tính tổng + promotion
            await applyPromotionsToItems(store.cart_id, store._id);
        }
        next();
    } catch (err) {
        console.error("Lỗi khi cập nhật sau khi xóa item:", err);
        next(err);
    }
});


const CartItemModel = mongoose.model("CartItem", cartItemSchema);
export default CartItemModel;
