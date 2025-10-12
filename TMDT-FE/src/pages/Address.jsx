import CustomModal from "./Modal";
import CustomSelect from "./CustomSelect";
import { useDisclosure, Button, Input } from "@heroui/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import axios from "axios";
import useAddress from "../hooks/useAdress";
import useToast from "../hooks/useToast";
import AdressCardList from "../components/AddressCardList";

function Address() {
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

  return (
    <>
      <div className="bg-white rounded-lg shadow flex justify-between mb-10 p-4">
        <div>
          <h2 className="text-2xl font-semibold text-blue-600">
            Địa Chỉ Của Tôi
          </h2>
          <p>Cập nhật địa chỉ để nhận hàng</p>
        </div>

        <Button color="primary" onPress={handleOpen}>
          + Thêm địa chỉ mới
        </Button>
      </div>
      <AdressCardList />

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
    </>
  );
}

export default Address;
