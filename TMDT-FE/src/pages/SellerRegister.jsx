import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import useToast from "../hooks/useToast";
import useAuth from "../hooks/useAuth";
import CustomModal from "./Modal";
import CustomSelect from "./CustomSelect";
import { Input, Button } from "@heroui/react";
import axios from "axios";
import api from "../utils/api";

export default function SellerRegister() {
  const { updateMe } = useAuth();
  const toast = useToast();

  const [frontPreview, setFrontPreview] = useState(null);
  const [backPreview, setBackPreview] = useState(null);

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const validationSchema = Yup.object({
    shopName: Yup.string().required("Tên cửa hàng không được để trống"),
    addressDetail: Yup.string().required(
      "Địa chỉ lấy hàng không được để trống"
    ),
    phone: Yup.string()
      .matches(/^(0|\+84)(\d{9})$/, "Số điện thoại không hợp lệ")
      .required("Số điện thoại không được để trống"),
    SKU: Yup.string()
      .matches(/^[A-Z]{3}$/, "SKU phải gồm đúng 3 chữ cái in hoa")
      .required("SKU không được để trống"),
    citizenID: Yup.string()
      .matches(/^[0-9]{12}$/, "CCCD phải gồm 12 chữ số")
      .required("Số CCCD không được để trống"),
    addressProvince: Yup.string().required("Chọn tỉnh/thành phố"),
    addressDistrict: Yup.string().required("Chọn quận/huyện"),
    addressWard: Yup.string().required("Chọn xã/phường"),
    frontID: Yup.mixed()
      .required("Vui lòng tải lên ảnh CCCD mặt trước")
      .test(
        "fileType",
        "File phải là ảnh",
        (value) => !value || (value && value.type.startsWith("image/"))
      ),
    backID: Yup.mixed()
      .required("Vui lòng tải lên ảnh CCCD mặt sau")
      .test(
        "fileType",
        "File phải là ảnh",
        (value) => !value || (value && value.type.startsWith("image/"))
      ),
  });

  const initialValues = {
    shopName: "",
    addressDetail: "",
    addressProvince: "",
    addressDistrict: "",
    addressWard: "",
    SKU: "",
    phone: "",
    citizenID: "",
    frontID: null,
    backID: null,
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const formData = new FormData();
      formData.append("name", values.shopName);
      formData.append(
        "address",
        `${values.addressDetail}, ${
          wards.find((w) => w.value == values.addressWard)?.name
        }, ${districts.find((d) => d.value == values.addressDistrict)?.name}, ${
          provinces.find((p) => p.value == values.addressProvince)?.name
        }`
      );
      formData.append("phone", values.phone);
      formData.append("citizenCode", values.citizenID);
      formData.append("SKU_code", values.SKU);

      if (values.frontID instanceof File) {
        formData.append("citizenImageFront", values.frontID);
      }
      if (values.backID instanceof File) {
        formData.append("citizenImageBack", values.backID);
      }

      const res = await api.post("/stores", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log(res);

      toast.success("Đăng ký thành công", "Cửa hàng của bạn đang chờ duyệt");
      resetForm();
      setFrontPreview(null);
      setBackPreview(null);
      setSelectedAddress("");
    } catch (err) {
      console.error(err);
      toast.error("Lỗi", err.response?.data?.message || "Không thể đăng ký");
    }
  };

  const loadProvinces = async () => {
    if (provinces.length === 0) {
      const res = await axios.get("https://provinces.open-api.vn/api/p/");
      setProvinces(
        res.data.map((p) => ({ label: p.name, value: p.code, name: p.name }))
      );
    }
    setIsAddressModalOpen(true);
  };

  const loadDistricts = async (provinceCode, setFieldValue) => {
    const res = await axios.get(
      `https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`
    );
    setDistricts(
      res.data.districts.map((d) => ({
        label: d.name,
        value: d.code,
        name: d.name,
      }))
    );
    setWards([]);
    setFieldValue("addressDistrict", "");
    setFieldValue("addressWard", "");
  };

  const loadWards = async (districtCode, setFieldValue) => {
    const res = await axios.get(
      `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
    );
    setWards(
      res.data.wards.map((w) => ({
        label: w.name,
        value: w.code,
        name: w.name,
      }))
    );
    setFieldValue("addressWard", "");
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isValid, setFieldValue, values, isSubmitting }) => (
        <Form className="grid grid-cols-10 gap-6 h-full">
          {/* Form bên trái */}
          <div className="col-span-6 bg-white rounded-lg shadow p-4">
            <h2 className="text-2xl font-semibold text-blue-600">
              Đăng ký làm người bán hàng
            </h2>
            <p>Điền các thông tin cơ bản để bắt đầu bán hàng</p>

            <div className="mt-10">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Tên cửa hàng
              </label>
              <Field
                type="text"
                name="shopName"
                className="w-full rounded-lg px-4 py-2.5 text-sm shadow-sm border border-gray-300 outline-none"
              />
              <ErrorMessage
                name="shopName"
                component="div"
                className="text-red-500 text-xs mt-1"
              />
            </div>

            <div className="mt-5">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Địa chỉ lấy hàng
              </label>
              <div className="flex gap-2">
                <Input
                  value={selectedAddress}
                  placeholder="Chọn địa chỉ"
                  readOnly
                  className="flex-1"
                />
                <Button color="primary" onPress={loadProvinces}>
                  Chọn
                </Button>
              </div>
              <ErrorMessage
                name="addressDetail"
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

            <div className="mt-5">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                SKU
              </label>
              <Field
                type="text"
                name="SKU"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              />
              <ErrorMessage
                name="SKU"
                component="div"
                className="text-red-500 text-xs mt-1"
              />
            </div>

            <div className="mt-5">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Số CCCD
              </label>
              <Field
                type="text"
                name="citizenID"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              />
              <ErrorMessage
                name="citizenID"
                component="div"
                className="text-red-500 text-xs mt-1"
              />
            </div>

            <div className="flex justify-center mt-5">
              <button
                type="submit"
                disabled={!isValid || updateMe.isPending}
                className="w-6/12 bg-blue-500 text-white py-2.5 rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-400 transition cursor-pointer"
              >
                {isSubmitting ? "Đang gửi..." : "Gửi đăng ký"}
              </button>
            </div>
          </div>

          <div className="col-span-4 mt-20 flex flex-col items-center gap-6">
            <div className="flex flex-col items-center">
              <input
                type="file"
                id="frontIDInput"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.currentTarget.files[0];
                  if (file) {
                    setFieldValue("frontID", file);
                    setFrontPreview(URL.createObjectURL(file));
                  }
                }}
              />
              {frontPreview ? (
                <img
                  src={frontPreview}
                  alt="CCCD mặt trước"
                  className="w-64 h-40 object-cover border rounded-lg cursor-pointer hover:opacity-80 transition"
                  onClick={() =>
                    document.getElementById("frontIDInput").click()
                  }
                />
              ) : (
                <div
                  onClick={() =>
                    document.getElementById("frontIDInput").click()
                  }
                  className="w-64 h-40 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 bg-white rounded-lg cursor-pointer hover:border-blue-400 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <p className="text-gray-500 text-sm mt-2">
                    Tải ảnh CCCD mặt trước
                  </p>
                </div>
              )}
              <ErrorMessage
                name="frontID"
                component="div"
                className="text-red-500 text-xs mt-1"
              />
            </div>

            <div className="flex flex-col items-center">
              <input
                type="file"
                id="backIDInput"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.currentTarget.files[0];
                  if (file) {
                    setFieldValue("backID", file);
                    setBackPreview(URL.createObjectURL(file));
                  }
                }}
              />
              {backPreview ? (
                <img
                  src={backPreview}
                  alt="CCCD mặt sau"
                  className="w-64 h-40 object-cover border rounded-lg cursor-pointer hover:opacity-80 transition"
                  onClick={() => document.getElementById("backIDInput").click()}
                />
              ) : (
                <div
                  onClick={() => document.getElementById("backIDInput").click()}
                  className="w-64 h-40 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 bg-white rounded-lg cursor-pointer hover:border-blue-400 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <p className="text-gray-500 text-sm mt-2">
                    Tải ảnh CCCD mặt sau
                  </p>
                </div>
              )}
              <ErrorMessage
                name="backID"
                component="div"
                className="text-red-500 text-xs mt-1"
              />
            </div>
          </div>

          <CustomModal
            isOpen={isAddressModalOpen}
            onClose={() => setIsAddressModalOpen(false)}
            title="Chọn địa chỉ lấy hàng"
            confirmText="Chọn"
            cancelText="Đóng"
            onConfirm={() => {
              if (
                !values.addressProvince ||
                !values.addressDistrict ||
                !values.addressWard ||
                !values.addressDetail
              ) {
                toast.error(
                  "Vui lòng chọn đầy đủ địa chỉ",
                  "Bạn chưa nhập đầy đủ thông tin"
                );
                return;
              }
              const provinceName = provinces.find(
                (p) => p.value == values.addressProvince
              )?.name;

              const districtName = districts.find(
                (d) => d.value == values.addressDistrict
              )?.name;
              const wardName = wards.find(
                (w) => w.value == values.addressWard
              )?.name;
              setSelectedAddress(
                `${values.addressDetail}, ${wardName}, ${districtName}, ${provinceName}`
              );
              setIsAddressModalOpen(false);
            }}
          >
            <div className="flex flex-col gap-4">
              <Field name="addressProvince">
                {({ field, form }) => (
                  <CustomSelect
                    label="Tỉnh/Thành phố"
                    placeholder="Chọn tỉnh"
                    options={provinces}
                    value={field.value}
                    onChange={(val) => {
                      form.setFieldValue("addressProvince", val);
                      loadDistricts(val, form.setFieldValue);
                    }}
                  />
                )}
              </Field>

              <Field name="addressDistrict">
                {({ field, form }) => (
                  <CustomSelect
                    label="Quận/Huyện"
                    placeholder="Chọn quận/huyện"
                    options={districts}
                    value={field.value}
                    onChange={(val) => {
                      form.setFieldValue("addressDistrict", val);
                      loadWards(val, form.setFieldValue);
                    }}
                  />
                )}
              </Field>

              <Field name="addressWard">
                {({ field, form }) => (
                  <CustomSelect
                    label="Xã/Phường"
                    placeholder="Chọn xã/phường"
                    options={wards}
                    value={field.value}
                    onChange={(val) => form.setFieldValue("addressWard", val)}
                  />
                )}
              </Field>

              <Field name="addressDetail">
                {({ field }) => (
                  <Input
                    {...field}
                    placeholder="Nhập địa chỉ cụ thể"
                    variant="bordered"
                  />
                )}
              </Field>
            </div>
          </CustomModal>
        </Form>
      )}
    </Formik>
  );
}
