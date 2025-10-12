import Login from "./pages/Login";
import { Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Authen from "./pages/Authen";
import Test from "./pages/Test";
import ForgotPassword from "./pages/ForgotPassword";
import MyAccount from "./pages/MyAccount";
import Profile from "./pages/Profile";
import Address from "./pages/Address";
import ChangePassword from "./pages/ChangePassword";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import SellerRegister from "./pages/SellerRegister";
import Cart from "./pages/Cart";

function App() {
  return (
    <Routes>
      <Route path="/myaccount" element={<MyAccount />}>
        <Route index element={<Profile />} />
        <Route path="profile" element={<Profile />} />
        <Route path="address" element={<Address />} />
        <Route path="change-password" element={<ChangePassword />} />
        <Route path="seller-register" element={<SellerRegister />} />
      </Route>

      <Route path="/authen" element={<Authen />}>
        <Route index element={<Login />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
      </Route>
      <Route path="/test" element={<Test />} />
      <Route path="/products" element={<Products />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />
      {/* <Route path="/listProduct" element={<ListProduct/>} /> */}
    </Routes>
  );
}

export default App;
