import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Button } from "@heroui/react";
import api from "../utils/api";
import CartDropdown from "../components/CartDropDown";



function Cart() {
  const [cart, setCart] = useState({});
  const [cartStores, setCartStores] = useState([]);

  const fetchCart = async () => {
    try {
      const res = await api.get(`/cart/`);
      setCart(res.data.data);
      setCartStores(res.data.data.Store);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto mt-30 px-4">
        <h1 className="text-2xl font-semibold mb-6">Giỏ hàng của bạn</h1>

        {cartStores.length === 0 ? (
          <p className="text-center text-gray-500">Giỏ hàng trống</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              {cartStores.map((store) => (
                <CartDropdown
                  key={store._id}
                  store={store}
                  onCartChange={fetchCart}
                />
              ))}
            </div>
            <div className="flex justify-between items-center mt-8 bg-gray-50 border-t border-gray-200 px-6 py-5 rounded-lg shadow-sm">
              <div>
                <p className="text-gray-600 text-sm">Tổng cộng</p>
                <p className="text-blue-600 text-2xl font-bold">
                  {cart.subTotal?.toLocaleString()} ₫
                </p>
              </div>

              <button className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:opacity-90 transition-all active:scale-95">
                Thanh toán
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}


export default Cart;
