import Input from "../components/Input";
import FadeContent from "../components/FadeContent";
import { useEffect, useState } from "react";
import api from "../utils/api";
import useToast from "../hooks/useToast";
import SpinnerLoad from "../components/Spinner";
import InputOTP from "../components/InputOTP";
import CountdownTimer from "../components/CountDownTimer";

import { Link, useNavigate } from "react-router-dom";
import {
  EyeFilledIcon,
  EyeSlashFilledIcon,
  LeftArrowIcon,
} from "../icons/icons";

export default function ForgotPassword() {
  const [isVisible, setIsVisible] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [otp, setOtp] = useState("");
  const [openOtp, setOpenOtp] = useState(false);

  const [resetTimer, setResetTimer] = useState(0);
  const [form, setForm] = useState({
    email: "",
    newPassword: "",
  });

  const navigate = useNavigate();

  const toast = useToast();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (openOtp) {
      setShowResend(false);
      const timer = setTimeout(() => {
        setShowResend(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [openOtp]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post("/users/forgot-password", {
        email: form.email,
      });
      setOpenOtp(true);
      toast.success("Đã gửi xác nhận", "Vui lòng kiểm tra email");
    } catch (err) {
      toast.error("Có lỗi xảy ra", err.response.data.message || "?");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log(form.email);
      await api.post("/users/resend-otp-forgot-password", {
        email: form.email,
      });

      toast.success("OTP đã được gửi lại", "Vui lòng kiểm tra lại email.");
      setResetTimer((k) => k + 1);
      setShowResend(false);
    } catch (err) {
      toast.error(
        "Có lỗi xảy ra",
        err.response?.data?.message || "Không thể gửi lại OTP"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await api.post("/users/verify-forgot-password", {
        email: form.email,
        otp,
      });
      toast.success("Xác nhận thành công", "Bạn có thể đổi mật khẩu");
      setShowResetPassword(true);
      setShowResend(false);
    } catch (err) {
      setOtpError(true);

      toast.error("Có lỗi xảy ra", err.response.data.message);
    }
  };

  const handleChangePassword = async () => {
    try {
      console.log(form.email, form.newPassword);
      await api.post("/users/reset-password", {
        email: form.email,
        newPassword: form.newPassword,
      });
      toast.success("Mật khẩu đã được thay đổi", "Bạn có thể đăng nhập lại");
      navigate("/login");
    } catch (err) {
      toast.error("Có lỗi xảy ra", err.response.data.message);
      console.log(err.response.data.message);
    }
  };

  return (
    <FadeContent
      blur={true}
      duration={800}
      easing="ease-out"
      initialOpacity={0}
      className="flex items-center justify-center pr-12 mr-20 ml-12 w-full max-w-md"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full space-y-4"
      >
        {!openOtp ? (
          <>
            <div className="relative">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                Quên mật khẩu?
              </h2>
              <div
                onClick={() => navigate("/authen/login")}
                className="absolute left-0 top-1 rounded-md 
               hover:bg-blue-100 cursor-pointer transition-colors"
              >
                <LeftArrowIcon className="text-blue-600 w-6 h-6 hover:text-blue-800" />
              </div>
            </div>

            <p className="text-sm text-gray-600 text-center mb-10">
              Nhập địa chỉ email để lấy lại mật khẩu
            </p>

            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="Nhập địa chỉ email"
              value={form.email}
              onChange={handleChange}
              error=""
            />

            {isloading ? (
              <button
                className=" flex justify-center gap-3 cursor-not-allowed w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-lg 
                   hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 opacity-80 "
                disabled={true}
              >
                <SpinnerLoad />
                <p>Đang gửi</p>
              </button>
            ) : (
              <button
                type="submit"
                className="cursor-pointer w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-lg 
                   hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Gửi Email
              </button>
            )}
          </>
        ) : !showResetPassword ? (
          <>
            <div className="relative">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                Lấy lại mật khẩu
              </h2>
              <div
                onClick={() => {
                  setOtp("");
                  setOpenOtp(false);
                }}
                className="absolute left-0 top-1 rounded-md 
               hover:bg-blue-100 cursor-pointer transition-colors"
              >
                <LeftArrowIcon className="text-blue-600 w-6 h-6 hover:text-blue-800" />
              </div>
            </div>

            <p className="text-gray-600">
              OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư và
              nhập mã để lấy lại mật khẩu
            </p>
            <div className="flex justify-center">
              <InputOTP
                isInvalid={otpError}
                onChange={setOtp}
                value={otp}
                onValueChange={(val) => {
                  setOtp(val);
                  if (otpError) setOtpError(false);
                }}
                onComplete={handleVerifyOtp}
              />
            </div>
            <div className="flex items-center justify-center">
              <p>Thời gian còn lại: </p>
              <CountdownTimer resetTrigger={resetTimer} />
            </div>

            {showResend && (
              <div>
                {!isloading ? (
                  <p className="text-center d text-gray-600">
                    Không nhận được mã?{" "}
                    <span
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={handleResendOtp}
                      className="font-semibold text-blue-600 cursor-pointer hover:text-blue-800"
                    >
                      Gửi lại OTP
                    </span>
                  </p>
                ) : (
                  <div className="flex justify-center gap-2 items-center">
                    <SpinnerLoad color="primary" />
                    <p className=" text-gray-600">Đang gửi lại OTP</p>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="relative">
            <h2 className="mb-8 text-2xl font-semibold text-gray-800 text-center">
              Nhập mật khẩu mới
            </h2>
            <div
              onClick={() => navigate("/authen/login")}
              className="absolute left-0 top-1 rounded-md 
               hover:bg-blue-100 cursor-pointer transition-colors"
            >
              <LeftArrowIcon className="text-blue-600 w-6 h-6 hover:text-blue-800" />
            </div>
            <div className="relative">
              <Input
                label="Mật khẩu mới"
                name="newPassword"
                placeholder="••••••••"
                type={!isVisible ? "password" : "text"}
                value={form.newPassword}
                onChange={handleChange}
                error=""
              />

              {isVisible ? (
                <EyeSlashFilledIcon
                  className="cursor-pointer absolute bottom-3 right-4"
                  onClick={() => setIsVisible(!isVisible)}
                />
              ) : (
                <EyeFilledIcon
                  className="cursor-pointer absolute bottom-3 right-4"
                  onClick={() => setIsVisible(!isVisible)}
                />
              )}
            </div>
            {isloading ? (
              <button
                className="mt-8 flex justify-center gap-3 cursor-not-allowed w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-lg 
                   hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 opacity-80 "
                disabled={true}
              >
                <SpinnerLoad />
                <p>Đang thay đổi</p>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleChangePassword}
                className=" mt-8 cursor-pointer w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-lg 
                   hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Thay đổi mật khẩu
              </button>
            )}
          </div>
        )}
      </form>
    </FadeContent>
  );
}
