import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useToast from "../hooks/useToast";

const MeDropDown = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        toast.success("Thành công", "Đăng xuất thành công");
        navigate("/authen/login");
      },
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setOpen(!open)}
        className="gap-2 flex items-center px-3 py-2 rounded-lg text-white font-medium hover:bg-white/20 transition cursor-pointer"
      >
        <img
          src= {user.avatar}
          alt="avatar"
          className="w-8 h-8 rounded-full border border-white"
        />
        <span className="font-medium">{user.username}</span>
      </div>

      <div
        className={`absolute left-0 mt-1 w-40 bg-gradient-to-r from-blue-500 to-indigo-600 text-white 
              rounded-lg shadow-lg border border-white/30 z-50 
              transform origin-top-right transition-all duration-200
              ${
                open
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
      >
        <Link
          to="/myaccount/profile"
          onClick={() => setOpen(false)}
          className="block px-4 py-2 hover:bg-white/20 transition"
        >
          Tài khoản của tôi
        </Link>
        <Link
          to="/myaccount/orders"
          onClick={() => setOpen(false)}
          className="block px-4 py-2 hover:bg-white/20 transition"
        >
          Đơn hàng
        </Link>
        <button
          onClick={handleLogout}
          className="cursor-pointer w-full text-left block px-4 py-2 hover:bg-white/20 hover:text-white transition"
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default MeDropDown;
