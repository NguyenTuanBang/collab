import { useEffect, useState } from "react";
import api from "../utils/api";

function CartDropdown({ store, onCartChange }) {
    const [isOpen, setIsOpen] = useState(true);
    const [showPromotionModal, setShowPromotionModal] = useState(false);
    const [items, setItems] = useState([])

    useEffect(() => {
        setItems(store.Item.map((item) => ({ ...item, selected: item.is_chosen })));
    }, [store]);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const increaseQuantity = async (id) => {
        try {
            setItems((prev) =>
                prev.map((item) =>
                    item._id === id ? { ...item, quantity: item.quantity + 1 } : item
                )
            );
            await api.post("/cart/increase", { cartItemId: id });
            onCartChange()
        } catch (err) {
            console.error(err);
        }
    };


    const removeItem = async (id) => {
        try {
            setItems((prev) => prev.filter((item) => item._id !== id));
            await api.post("/cart/remove", { cartItemId: id });
            onCartChange()
        } catch (err) {
            console.error(err);
        }
    };



    const decreaseQuantity = async (id) => {
        try {
            const item = items.find(i => i._id === id);
            if (item.quantity <= 1) return;

            setItems((prev) =>
                prev.map((i) =>
                    i._id === id ? { ...i, quantity: i.quantity - 1 } : i
                )
            );
            await api.post("/cart/reduce", { cartItemId: id });
            onCartChange()
        } catch (err) {
            console.error(err);
        }
    };


    const toggleSelect = async (id) => {
        try {
            // 1. Lấy trạng thái hiện tại của item
            const item = items.find(i => i._id === id);
            if (!item) return; // item không tồn tại thì thôi

            // 2. Tạo trạng thái mới (toggle)
            const newSelected = !item.selected;

            // 3. Cập nhật state frontend
            setItems(prev =>
                prev.map(i =>
                    i._id === id ? { ...i, selected: newSelected } : i
                )
            );

            // 4. Gửi trạng thái mới lên backend
            await api.post("/cart/change", { cartItemId: id, is_chosen: newSelected });
            onCartChange()
        } catch (err) {
            console.error("Lỗi toggleSelect:", err);
        }
    };


    const allSelected = items.every(item => item.selected);

    const toggleSelectAll = async () => {
        try {
            const newState = !allSelected; // trạng thái mới của tất cả items
            setItems(prev => prev.map(item => ({ ...item, selected: newState })));

            // Gọi API 1 lần cho từng item (hoặc bạn có thể viết API toggle nhiều item cùng lúc)
            await Promise.all(
                items.map(item =>
                    api.post("/cart/change", {
                        cartItemId: item._id,
                        is_chosen: newState // truyền trạng thái mới
                    })
                )
            );
            onCartChange()
        } catch (err) {
            console.error(err);
        }
    };



    const [availablePromotions, setAvailablePromotions] = useState([]);

    const handleSelectPromotion = async (promo) => {
        try {
            await api.post("/cart/add-promotion", { promotion_id: promo._id });
            setShowPromotionModal(false);
            console.log("Promotion applied:", promo);
        } catch (err) {
            console.error(err);
        }
    };
    return (
        <>
            <div className="border rounded shadow p-4">
                {/* Header */}
                <div className="flex justify-between items-center w-full font-semibold cursor-pointer">
                    {/* Checkbox + Avatar + StoreName */}
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={allSelected}
                            onClick={(e) => e.stopPropagation()} // ngăn click lan ra parent
                            onChange={toggleSelectAll} // toggle select all items
                            className="w-4 h-4"
                        />
                        <div
                            className="flex items-center space-x-2"
                            onClick={toggleDropdown} // click avatar + tên toggle dropdown
                        >
                            <img
                                src={store.store_id.user.avatar}
                                alt={store.store_id.name}
                                className="w-10 h-10 object-cover rounded"
                            />
                            <span>{store.store_id.name}</span>
                        </div>
                    </div>

                    {/* Dropdown arrow */}
                    <span className="cursor-pointer" onClick={toggleDropdown}>
                        {isOpen ? "▲" : "▼"}
                    </span>
                </div>


                {/* Content */}
                {isOpen && (
                    <div className="mt-2 space-y-2">
                        {items.map((item) => (
                            <div
                                key={item._id}
                                className="flex items-center justify-between p-2 border rounded"
                            >
                                {/* Checkbox + Image + Info */}
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={item.selected}
                                        onChange={() => toggleSelect(item._id)}
                                        className="w-4 h-4"
                                    />
                                    <img
                                        src={item.variant_id.image.url}
                                        alt={item.variant_id.product_id.name}
                                        className="w-12 h-12 object-cover rounded"
                                    />
                                    <div>
                                        <p className="font-medium">
                                            {item.variant_id.product_id.name} -{" "}
                                            {item.variant_id.size.size_value} -{" "}
                                            {item.variant_id.image.color}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {item.unitPrice.toLocaleString()}₫
                                        </p>
                                    </div>
                                </div>

                                {/* Quantity + TotalPrice */}
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => decreaseQuantity(item._id)}
                                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                    >
                                        -
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button
                                        onClick={() => increaseQuantity(item._id)}
                                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                    >
                                        +
                                    </button>
                                    <div className="ml-4 text-right">
                                        {item.discountValue && item.discountValue !== 0 ? (
                                            <>
                                                <p className="text-gray-400 line-through text-sm">
                                                    {(item.finalPrice + item.discountValue).toLocaleString()}₫
                                                </p>
                                                <p className="font-semibold">
                                                    {(item.finalPrice).toLocaleString()}₫
                                                </p>
                                            </>
                                        ) : (
                                            <p className="font-semibold">{item.finalPrice.toLocaleString()}₫</p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => removeItem(item._id)}
                                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        Xóa
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
                {isOpen && items.some((item) => item.selected) && (
                    <div
                        className="mt-2 p-3 border rounded bg-yellow-50 cursor-pointer hover:bg-yellow-100"
                        onClick={() => setShowPromotionModal(true)}
                    >
                        <p className="font-medium text-yellow-700">
                            Áp dụng khuyến mãi: {store.promotion?.name} - {store.promotion?.description}
                        </p>
                    </div>
                )}

                {showPromotionModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded shadow-lg w-96">
                            <h2 className="text-xl font-semibold mb-4">Chọn khuyến mãi</h2>
                            {/* Ví dụ danh sách promotion */}
                            <ul className="space-y-2">
                                {availablePromotions.map((promo) => (
                                    <li
                                        key={promo._id}
                                        className="p-2 border rounded hover:bg-gray-100 cursor-pointer"
                                        onClick={() => handleSelectPromotion(promo)}
                                    >
                                        {promo.name} - {promo.description}
                                    </li>
                                ))}
                            </ul>
                            <button
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                                onClick={() => setShowPromotionModal(false)}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default CartDropdown;
