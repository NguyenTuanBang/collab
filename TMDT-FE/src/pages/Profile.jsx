import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import useToast from "../hooks/useToast";
import useAuth from "../hooks/useAuth";

export default function Profile() {
  const { user, updateMe } = useAuth();
  const [preview, setPreview] = useState(null);
  const toast = useToast();

  const validationSchema = Yup.object({
    fullname: Yup.string().required("Họ và tên không được để trống"),
    phone: Yup.string()
      .matches(/^(0|\+84)(\d{9})$/, "Số điện thoại không hợp lệ")
      .required("Số điện thoại không được để trống"),
  });

  const initialValues = {
    username: user?.username || "",
    email: user?.email || "",
    fullname: user?.fullname || "",
    phone: user?.phone || "",
    avatar: user?.avatar || "default.jpg",
  };

  // const avatarUrl =
  //   preview ||
  //   (user?.avatar
  //     ? `http://localhost:3000/img/avatars/${user.avatar}`
  //     : "http://localhost:3000/img/avatars/default.png");
  const avatarUrl =
    preview ||
    user?.avatar ||
    "https://res.cloudinary.com/demo/image/upload/v1720000000/default_avatar.png";

  // const handleSubmit = (values) => {
  //   const formData = new FormData();
  //   formData.append("fullname", values.fullname);
  //   formData.append("phone", values.phone);

  //   if (values.avatar instanceof File) {
  //     formData.append("avatar", values.avatar);
  //   }

  //   updateMe.mutate(formData, {
  //     onSuccess: (updatedUser) => {
  //       setPreview(
  //         values.avatar instanceof File
  //           ? URL.createObjectURL(values.avatar)
  //           : updatedUser.avatar
  //           ? `http://localhost:3000/img/avatars/${updatedUser.avatar}`
  //           : "http://localhost:3000/img/avatars/default.jpg"
  //       );
  //       toast.success("Thành công", "Thông tin đã được cập nhật");
  //     },
  //     onError: () => {
  //       toast.error("Đã có lỗi xảy ra", "Vui lòng thử lại sau");
  //     },
  //   });
  // };
  const handleSubmit = (values) => {
    const formData = new FormData();
    formData.append("fullname", values.fullname);
    formData.append("phone", values.phone);

    if (values.avatar instanceof File) {
      formData.append("avatar", values.avatar);
    }

    updateMe.mutate(formData, {
      onSuccess: (updatedUser) => {
        setPreview(
          values.avatar instanceof File
            ? URL.createObjectURL(values.avatar)
            : updatedUser.avatar ||
            "https://via.placeholder.com/150?text=Avatar"
        );
        toast.success("Thành công", "Thông tin đã được cập nhật");
      },
      onError: () => {
        toast.error("Đã có lỗi xảy ra", "Vui lòng thử lại sau");
      },
    });
  };


  if (!user) return null;

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isValid, setFieldValue }) => (
        <Form className="grid grid-cols-10 gap-6 h-full ">
          <div className="col-span-6 bg-white rounded-lg shadow p-4">
            <h2 className="text-2xl font-semibold text-blue-600">
              Hồ Sơ Của Tôi
            </h2>
            <p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>

            <div className="mt-10">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Tên đăng nhập
              </label>
              <Field
                type="text"
                name="username"
                readOnly
                className="w-full rounded-lg px-4 py-2.5 text-sm shadow-sm border border-gray-300 outline-none"
              />
            </div>

            <div className="mt-5">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Email
              </label>
              <Field
                type="email"
                name="email"
                readOnly
                className="w-full rounded-lg px-4 py-2.5 text-sm shadow-sm border border-gray-300 outline-none"
              />
            </div>

            <div className="mt-5">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Họ và tên
              </label>
              <Field
                type="text"
                name="fullname"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              />
              <ErrorMessage
                name="fullname"
                component="div"
                className="text-red-500 text-xs mt-1"
              />
            </div>

            <div className="mt-5">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Số điện thoại
              </label>
              <Field
                type="text"
                name="phone"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              />
              <ErrorMessage
                name="phone"
                component="div"
                className="text-red-500 text-xs mt-1"
              />
            </div>
            <div className="flex justify-center mt-5">
              <button
                type="submit"
                disabled={updateMe.isPending || !isValid}
                className="w-6/12 bg-blue-500 text-white py-2.5 rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-400 transition cursor-pointer"
              >
                {updateMe.isPending ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </div>

          <div className="col-span-4 mt-52">
            <div className="flex flex-col items-center justify-center">
              <input
                type="file"
                id="avatarInput"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.currentTarget.files[0];
                  if (file) {
                    setFieldValue("avatar", file);
                    setPreview(URL.createObjectURL(file));
                  }
                }}
              />
              <img
                src={avatarUrl}
                alt="avatar"
                className="w-48 h-48 rounded-full object-cover border mb-3 cursor-pointer hover:opacity-80 transition"
                onClick={() => document.getElementById("avatarInput").click()}
              />
              <p className="text-sm text-gray-500">Chọn ảnh</p>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
