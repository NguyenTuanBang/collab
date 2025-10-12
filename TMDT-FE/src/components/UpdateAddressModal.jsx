import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import CustomSelect from "../pages/CustomSelect";
import axios from "axios";
import { useState, useEffect } from "react";
import useAddress from "../hooks/useAdress";
import useToast from "../hooks/useToast";

export default function UpdateAddressModal({ isOpen, onClose, initialData }) {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const toast = useToast();

  function findCodeByName(list, name) {
    const item = list.find((i) => i.name === name);
    return item ? item.value : "";
  }
  const { updateAddress } = useAddress();

  useEffect(() => {
    if (isOpen) {
      axios.get("https://provinces.open-api.vn/api/p/").then(async (res) => {
        const data = res.data.map((p) => ({
          label: p.name,
          value: String(p.code),
          name: p.name,
        }));
        setProvinces(data);

        const provinceCode = findCodeByName(data, initialData?.province);

        if (provinceCode) {
          const dRes = await axios.get(
            `https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`
          );
          const districtsData = dRes.data.districts.map((d) => ({
            label: d.name,
            value: String(d.code),
            name: d.name,
          }));
          setDistricts(districtsData);

          const districtCode = findCodeByName(
            districtsData,
            initialData?.district
          );

          if (districtCode) {
            const wRes = await axios.get(
              `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
            );
            const wardsData = wRes.data.wards.map((w) => ({
              label: w.name,
              value: String(w.code),
              name: w.name,
            }));
            setWards(wardsData);
          }
        }
      });
    }
  }, [isOpen, initialData]);

  const fetchDistricts = async (provinceCode, setFieldValue) => {
    const res = await axios.get(
      `https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`
    );
    const data = res.data.districts.map((d) => ({
      label: d.name,
      value: String(d.code),
      name: d.name,
    }));
    setDistricts(data);
    setWards([]);
    setFieldValue("district", "");
    setFieldValue("ward", "");
  };

  const fetchWards = async (districtCode, setFieldValue) => {
    const res = await axios.get(
      `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
    );
    const data = res.data.wards.map((w) => ({
      label: w.name,
      value: String(w.code),
      name: w.name,
    }));
    setWards(data);
    setFieldValue("ward", "");
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Vui lòng nhập tên"),
    phone: Yup.string()
      .matches(/^(0|\+84)(\d{9})$/, "Số điện thoại không hợp lệ")
      .required("Vui lòng nhập số điện thoại"),
    province: Yup.string().required("Vui lòng chọn tỉnh/thành phố"),
    district: Yup.string().required("Vui lòng chọn quận/huyện"),
    ward: Yup.string().required("Vui lòng chọn xã/phường"),
    detail: Yup.string().required("Vui lòng nhập địa chỉ cụ thể"),
  });

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="lg">
      <ModalContent>
        <Formik
          enableReinitialize
          initialValues={{
            name: initialData?.name || "",
            phone: initialData?.phone || "",
            detail: initialData?.detail || "",
            province: findCodeByName(provinces, initialData?.province),
            district: findCodeByName(districts, initialData?.district),
            ward: findCodeByName(wards, initialData?.ward),
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            updateAddress.mutate(
              {
                id: initialData._id,
                ...values,
                province: provinces.find((p) => p.value === values.province)
                  ?.name,
                district: districts.find((d) => d.value === values.district)
                  ?.name,
                ward: wards.find((w) => w.value === values.ward)?.name,
              },
              {
                onSuccess: () => {
                  onClose();
                  toast.success("Thành công", "Cập nhật địa chỉ thành công");
                },
              }
            );
          }}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <ModalHeader>Cập nhật địa chỉ</ModalHeader>
              <ModalBody className="space-y-3">
                <div>
                  <Field
                    as={Input}
                    name="name"
                    label="Tên"
                    placeholder="Nhập tên"
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

                <Field name="province">
                  {({ field, form }) => (
                    <CustomSelect
                      label="Tỉnh/Thành phố"
                      options={provinces}
                      placeholder="Chọn tỉnh"
                      value={field.value}
                      onChange={(val) => {
                        form.setFieldValue("province", val);
                        fetchDistricts(val, form.setFieldValue);
                      }}
                    />
                  )}
                </Field>

                <Field name="district">
                  {({ field, form }) => (
                    <CustomSelect
                      label="Quận/Huyện"
                      options={districts}
                      placeholder="Chọn quận/huyện"
                      value={field.value}
                      onChange={(val) => {
                        form.setFieldValue("district", val);
                        fetchWards(val, form.setFieldValue);
                      }}
                    />
                  )}
                </Field>

                <Field name="ward">
                  {({ field, form }) => (
                    <CustomSelect
                      label="Xã/Phường"
                      options={wards}
                      placeholder="Chọn xã/phường"
                      value={field.value}
                      onChange={(val) => form.setFieldValue("ward", val)}
                    />
                  )}
                </Field>

                <div>
                  <Field
                    as={Input}
                    name="detail"
                    label="Địa chỉ cụ thể"
                    placeholder="Nhập địa chỉ cụ thể"
                    variant="bordered"
                  />
                  <ErrorMessage
                    name="detail"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Hủy
                </Button>
                <Button color="primary" type="submit">
                  Lưu
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
}
