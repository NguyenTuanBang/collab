import { Outlet } from "react-router-dom";
import TextType from "../components/TypeText";

function Authen() {
  return (
    <div className="relative min-h-screen bg-gradient-to-r from-green-300 via-blue-500 to-indigo-600 flex">
      <div className="flex-1 flex flex-col items-center justify-center ml-24">
        <img className="w-60 h-60 object-contain" src="/logo.png" alt="logo" />

        <TextType
          text={[
            "Nền tảng thương mại điện tử được yêu thích",
            "Mua sắm trực tuyến nhanh chóng",
            "Ưu đãi hấp dẫn mỗi ngày",
            "Trải nghiệm dễ dàng và tiện lợi",
          ]}
          typingSpeed={100}
          pauseDuration={1500}
          showCursor={true}
          cursorCharacter="_"
          className="text-white text-4xl md:text-5xl lg:text-4xl font-extrabold tracking-tight leading-snug text-center"
        />
      </div>
      <Outlet />
    </div>
  );
}

export default Authen;
