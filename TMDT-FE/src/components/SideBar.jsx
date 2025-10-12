import {
  BellIcon,
  UserIcon,
  Cog6ToothIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  TicketIcon,
} from "@heroicons/react/24/outline";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import useAuth from "../hooks/useAuth";

export default function Sidebar() {
  const [open, setOpen] = useState("Tài Khoản của tôi");
  const { user, isLoading } = useAuth();

  const menu = [
    { name: "Thông báo", icon: BellIcon, link: "/notifications" },
    {
      name: "Tài Khoản của tôi",
      icon: UserIcon,
      children: [
        { name: "Hồ sơ", link: "/myaccount/profile" },
        { name: "Địa chỉ", link: "/myaccount/address" },
        { name: "Đổi mật khẩu", link: "/myaccount/change-password" },
        { name: "Đăng ký làm người bán", link: "/myaccount/seller-register" },
      ],
    },
    {
      name: "Lịch sử đơn hàng",
      icon: DocumentTextIcon,
      children: [
        { name: "Reports", link: "/orders/reports" },
        { name: "Performance", link: "/orders/performance" },
      ],
    },
    { name: "Voucher", icon: TicketIcon, link: "/voucher" },
    { name: "Cài đặt", icon: Cog6ToothIcon, link: "/settings" },
  ];

  if (isLoading) return <p>Isloading</p>;
  if (!user) return <p>Chưa đăng nhập</p>;
  return (
    <div className="h-screen bg-gray-100 border-r border-gray-200 p-4 flex flex-col">
      <div className="mt-auto flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-200 cursor-pointer">
        <img
          src={user.avatar}
          alt="User Avatar"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="text-sm font-medium">{user.username}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {menu.map((item) => (
          <div key={item.name}>
            {item.children ? (
              <button
                onClick={() => setOpen(open === item.name ? null : item.name)}
                className="cursor-pointer flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg transition text-gray-700 hover:bg-gray-200"
              >
                <div className="flex items-center">
                  <item.icon className="w-5 h-5 mr-2" />
                  {item.name}
                </div>
                <ChevronRightIcon
                  className={`w-4 h-4 transition-transform ${
                    open === item.name ? "rotate-90" : ""
                  }`}
                />
              </button>
            ) : (
              <NavLink
                to={item.link}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm rounded-lg transition ${
                    isActive
                      ? "bg-blue-500 text-white"
                      : "text-gray-700 hover:bg-gray-200"
                  }`
                }
              >
                <item.icon className="w-5 h-5 mr-2" />
                {item.name}
              </NavLink>
            )}

            <div
              className={`ml-8 mt-1 overflow-hidden transition-all duration-500 ease-in-out ${
                open === item.name ? "max-h-40" : "max-h-0"
              }`}
            >
              <div className="space-y-1">
                {item.children?.map((child) => (
                  <NavLink
                    key={child.name}
                    to={child.link}
                    className={({ isActive }) =>
                      `block w-full text-left px-2 py-1 rounded-md text-sm ${
                        isActive
                          ? "bg-blue-400 text-white"
                          : "text-gray-600 hover:bg-gray-200"
                      }`
                    }
                  >
                    {child.name}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}
