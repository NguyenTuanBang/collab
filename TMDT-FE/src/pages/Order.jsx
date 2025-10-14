import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import api from "../utils/api";
import Navbar from "../components/Navbar";
import CustomModal from "./Modal";
import CustomSelect from "./CustomSelect";
import { useDisclosure, Button, Input } from "@heroui/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import useAddress from "../hooks/useAdress";
import useToast from "../hooks/useToast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

const Order = () => {
  const user = useAuth();
  const [chosenAddress, setChosenAddress] = useState({});
  const [listAddress, setListAdress] = useState([]);
  const [preOrder, setPreOrder] = useState({});
  const [isAddressDropdownOpen, setIsAddressDropdownOpen] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get("/users/me/address");
      const resAddress = res.data.data;
      setListAdress(resAddress.filter((item) => item.isDefault === false));
      setChosenAddress(resAddress.find((item) => item.isDefault));
    };
    fetchData();
  }, []);

  const fetchPreOrder = async () => {
    if (chosenAddress) {
      await api.post("/cart/shippingFee", { addressId: chosenAddress._id });
      const res = await api.get("/cart/preOrder");
      setPreOrder(res.data.data);
    }else{
      handleOpen()
    }
  };
  useEffect(() => {
    if (chosenAddress && chosenAddress._id) fetchPreOrder();
  }, [chosenAddress]);

  const chooseNewAddress = (id) => {
    const newChosen = listAddress.find((item) => item._id === id);
    const newList = [
      ...listAddress.filter((item) => item._id !== id),
      chosenAddress,
    ];
    setChosenAddress(newChosen);
    setListAdress(newList);
    setIsAddressDropdownOpen(false);
  };

  const onPayment = async ()=>{
    onPaymentMutation.mutate()
  }
  const onPaymentMutation = useMutation({
      mutationFn: async () => {
        return await api.post('/order', {address: chosenAddress._id})
      },
      onSuccess: () => {
        toast.success("Thành công", "Vui lòng ấn vào giỏ hàng để xem thêm")
        navigate("/products")
        queryClient.invalidateQueries(["cartCount"]);
      },
      onError: (err) => {
        toast.error("Lỗi", "Vui lòng thử lại");
        console.error(err);
      },
    });

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const { addAddress } = useAddress();

  const toast = useToast();

  const handleOpen = async () => {
    try {
      if (provinces.length === 0) {
        const res = await axios.get("https://provinces.open-api.vn/api/p/");
        const data = res.data.map((p) => ({
          label: p.name,
          value: p.code,
          name: p.name,
        }));
        setProvinces(data);
      }
      onOpen();
    } catch (err) {
      console.error("Lỗi load tỉnh:", err);
    }
  };

  const fetchDistricts = async (provinceCode, setFieldValue) => {
    try {
      const res = await axios.get(
        `https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`
      );
      const data = res.data.districts.map((d) => ({
        label: d.name,
        value: d.code,
        name: d.name,
      }));

      setDistricts(data);
      setWards([]);
      setFieldValue("district", "");
      setFieldValue("ward", "");
    } catch (err) {
      console.error("Lỗi load huyện:", err);
    }
  };

  const fetchWards = async (districtCode, setFieldValue) => {
    try {
      const res = await axios.get(
        `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
      );
      const data = res.data.wards.map((w) => ({
        label: w.name,
        value: w.code,
        name: w.name,
      }));
      setWards(data);
      setFieldValue("ward", "");
    } catch (err) {
      console.error("Lỗi load xã:", err);
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Vui lòng nhập tên"),
    phone: Yup.string()
      .matches(/^(0|\+84)(\d{9})$/, "Số điện thoại không hợp lệ")
      .required("Vui lòng nhập số điện thoại"),
    province: Yup.string().required("Vui lòng chọn tỉnh/thành phố"),
    district: Yup.string().required("Vui lòng chọn quận/huyện"),
    ward: Yup.string().required("Vui lòng chọn xã/phường"),
    detail: Yup.string().required("Vui lòng nhập địa chỉ"),
  });

  const handleSubmit = (values, { resetForm }) => {
    console.log(provinces);
    console.log(values.province);
    const province = provinces.find((p) => p.value == values.province)?.name;
    const district = districts.find((d) => d.value == values.district)?.name;
    const ward = wards.find((w) => w.value == values.ward)?.name;

    const finalValues = {
      ...values,
      province,
      district,
      ward,
    };

    addAddress.mutate(finalValues, {
      onSuccess: () => {
        resetForm();
        onOpenChange(false);
        toast.success("Thành công", "Bạn đã thêm một địa chỉ mới");
      },
      onError: (err) => {
        console.log(err);
      },
    });
  };

  const formNewAddress = () => {
    return(
    <Formik
      initialValues={{
        name: "",
        phone: "",
        detail: "",
        province: "",
        district: "",
        ward: "",
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ handleSubmit }) => (
        <Form id="address-form" onSubmit={handleSubmit}>
          <CustomModal
            isOpen={isOpen}
            onClose={onOpenChange}
            title="Nhập thông tin địa chỉ"
            confirmText="Lưu"
            cancelText="Đóng"
            formId="address-form"
          >
            <div>
              <Field
                as={Input}
                name="name"
                label="Tên"
                placeholder="Nhập tên của bạn"
                variant="bordered"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <Field
                as={Input}
                name="phone"
                label="Số điện thoại"
                placeholder="Nhập số điện thoại"
                variant="bordered"
              />
              <ErrorMessage
                name="phone"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <Field name="province">
                {({ field, form }) => (
                  <CustomSelect
                    label="Tỉnh/Thành phố"
                    placeholder="Chọn tỉnh"
                    options={provinces}
                    value={field.value}
                    onChange={(val) => {
                      form.setFieldValue("province", val);
                      fetchDistricts(val, form.setFieldValue);
                    }}
                    error={
                      form.errors.province && form.touched.province
                        ? form.errors.province
                        : null
                    }
                  />
                )}
              </Field>
            </div>

            <div>
              <Field name="district">
                {({ field, form }) => (
                  <CustomSelect
                    label="Quận/Huyện"
                    placeholder="Chọn quận/huyện"
                    options={districts}
                    value={field.value}
                    onChange={(val) => {
                      form.setFieldValue("district", val);
                      fetchWards(val, form.setFieldValue);
                    }}
                    error={
                      form.errors.district && form.touched.district
                        ? form.errors.district
                        : null
                    }
                  />
                )}
              </Field>
            </div>

            <div>
              <Field name="ward">
                {({ field, form }) => (
                  <CustomSelect
                    label="Xã/Phường"
                    placeholder="Chọn xã/phường"
                    options={wards}
                    value={field.value}
                    onChange={(val) => form.setFieldValue("ward", val)}
                    error={
                      form.errors.ward && form.touched.ward
                        ? form.errors.ward
                        : null
                    }
                  />
                )}
              </Field>
            </div>

            <div>
              <div>
                <Field
                  as={Input}
                  name="detail"
                  label="Nhập địa chỉ cụ thể"
                  placeholder="Nhập địa chỉ cụ thể của bạn"
                  variant="bordered"
                />
                <ErrorMessage
                  name="detail"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
            </div>
          </CustomModal>
        </Form>
      )}
    </Formik>
    )
  };

  return (
    <>
      <Navbar></Navbar>
      <div className="max-w-4xl mx-auto p-4 mt-[60px]">
        <div className="relative mb-6">
          <div
            className="border p-3 rounded-lg flex justify-between items-center cursor-pointer bg-white shadow-sm"
            onClick={() => setIsAddressDropdownOpen(!isAddressDropdownOpen)}
          >
            {chosenAddress ? (
              <div>
                <p className="font-semibold">{chosenAddress.name}</p>
                <p className="text-gray-600 text-sm">{chosenAddress.phone}</p>
                <p className="text-gray-500 text-sm">
                  {chosenAddress.specificAddress} {chosenAddress.ward},{" "}
                  {chosenAddress.district}, {chosenAddress.province}
                </p>
              </div>
            ) : (
              <p className="text-gray-400 italic">Chưa có địa chỉ được chọn</p>
            )}
            <span>{isAddressDropdownOpen ? "▲" : "▼"}</span>
          </div>

          {isAddressDropdownOpen && (
            <div className="absolute z-10 w-full bg-white border mt-2 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {listAddress.length > 1 ? (
                listAddress
                  .filter((addr) => addr._id !== chosenAddress?._id)
                  .map((addr) => (
                    <div
                      key={addr._id}
                      onClick={() => chooseNewAddress(addr._id)}
                      className="p-3 hover:bg-gray-100 cursor-pointer"
                    >
                      <p className="font-semibold">{addr.fullName}</p>
                      <p className="text-gray-600 text-sm">{addr.phone}</p>
                      <p className="text-gray-500 text-sm truncate">
                        {addr.specificAddress}, {addr.ward}, {addr.district},{" "}
                        {addr.city}
                      </p>
                    </div>
                  ))
              ) : (
                <div className="p-3 text-center text-blue-500 cursor-pointer hover:underline">
                  <Button color="primary" onPress={handleOpen}>
                    + Thêm địa chỉ mới
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
        {!chosenAddress && (
          <div className="border p-6 rounded-lg shadow bg-gray-50 text-center text-gray-600">
            <p>
              Chưa có địa chỉ. Hãy thêm địa chỉ giao hàng trước khi đặt hàng.
            </p>
          </div>
        )}
        {chosenAddress && preOrder?.Store && preOrder.Store.length > 0 && (
          <div className="space-y-6  overflow-y-auto max-h-[80%]">
            {preOrder.Store.map((store) => (
              <div
                key={store._id}
                className="border rounded-lg shadow p-4 bg-white"
              >
                <div className="flex items-center space-x-3 border-b pb-2 mb-3">
                  <img
                    src={store.store_id.user.avatar}
                    alt={store.store_id.name}
                    className="w-10 h-10 rounded"
                  />
                  <div>
                    <p className="font-semibold">{store.store_id.name}</p>
                    {store.shippingFee !== undefined && (
                      <p className="text-sm text-gray-500">
                        Phí giao hàng: {store.shippingFee.toLocaleString()}₫
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  {store.Item.map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between items-center border rounded p-2"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.variant_id.image.url}
                          alt={item.variant_id.product_id.name}
                          className="w-14 h-14 rounded object-cover"
                        />
                        <div>
                          <p className="font-medium">
                            {item.variant_id.product_id.name} -{" "}
                            {item.variant_id.size.size_value} -{" "}
                            {item.variant_id.image.color}
                          </p>
                          <p className="text-gray-500 text-sm">
                            Đơn giá: {item.unitPrice.toLocaleString()}₫ ×{" "}
                            {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {item.discountValue && item.discountValue !== 0 ? (
                          <>
                            <p className="text-gray-400 line-through text-sm">
                              {(
                                item.unitPrice * item.quantity
                              ).toLocaleString()}
                              ₫
                            </p>
                            <p className="font-semibold text-red-600">
                              {item.finalPrice.toLocaleString()}₫
                            </p>
                          </>
                        ) : (
                          <p className="font-semibold">
                            {(
                              item.finalPrice || item.unitPrice * item.quantity
                            ).toLocaleString()}
                            ₫
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {store.promotion && (
                  <div className="mt-3 bg-yellow-50 border p-2 rounded text-sm text-yellow-700">
                    Khuyến mãi áp dụng: <b>{store.promotion.name}</b> –{" "}
                    {store.promotion.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {chosenAddress && (!preOrder?.Store || preOrder.Store.length === 0) && (
          <p className="text-gray-500 text-center mt-6">
            Giỏ hàng trống hoặc chưa có sản phẩm được chọn để đặt trước.
          </p>
        )}
        {preOrder && preOrder.Store && (
          <div className="mt-8 border-t pt-4 flex justify-between items-center">
            <div className="text-lg font-semibold">
              Tổng tiền:{" "}
              <span className="text-red-500">
                {preOrder.finalTotal?.toLocaleString() || 0}₫
              </span>
            </div>
            <button
              onClick={() => onPayment()}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Mua hàng
            </button>
          </div>
        )}
      </div>
      {formNewAddress()}
    </>
  );
};

export default Order;
