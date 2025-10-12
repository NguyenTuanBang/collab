import { useState } from "react";
import { EyeSlashFilledIcon, EyeFilledIcon } from "../icons/icons";
import { Input, Button } from "@heroui/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import useAuth from "../hooks/useAuth";
import useToast from "../hooks/useToast";

const confirmSchema = Yup.object({
  currentPassword: Yup.string().required("Vui lòng nhập mật khẩu hiện tại"),
});

const changeSchema = Yup.object({
  newPassword: Yup.string()
    .min(8, "Mật khẩu tối thiểu 8 ký tự")
    .matches(
      /^(?=.*[0-9])(?=.*[!@#$%^&*])/,
      "Mật khẩu phải có ít nhất 1 số và 1 ký tự đặc biệt"
    )
    .required("Vui lòng nhập mật khẩu mới"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Mật khẩu xác nhận không khớp")
    .required("Vui lòng xác nhận mật khẩu mới"),
});

function ChangePassword() {
  const toast = useToast();
  const { confirmChangePassword, changePassword } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState(1);

  const handleConfirm = (values, { resetForm }) => {
    confirmChangePassword.mutate(values, {
      onSuccess: () => {
        toast.success("Thành công", "Xác minh mật khẩu thành công");
        resetForm();
        setStep(2);
      },
      onError: () => {
        toast.error("Đã có lỗi xảy ra", "Mật khẩu xác minh không khớp");
      },
    });
  };

  const handleChangePassword = (values, { resetForm }) => {
    changePassword.mutate(values, {
      onSuccess: () => {
        toast.success("Đổi mật khẩu", "Mật khẩu đã được thay đổi thành công");
        resetForm();
        setStep(1);
      },
      onError: () => {
        toast.error("Đã có lỗi xảy ra", "Không thể đổi mật khẩu");
      },
    });
  };

  return (
    <div className="bg-white rounded-lg shadow mb-10 p-6 max-w-md">
      <h2 className="text-2xl font-semibold text-blue-600 mb-6">
        {step === 1 ? "Xác minh mật khẩu" : "Đổi mật khẩu mới"}
      </h2>

      {step === 1 ? (
        <Formik
          initialValues={{ currentPassword: "" }}
          validationSchema={confirmSchema}
          onSubmit={handleConfirm}
        >
          {({ handleChange, values }) => (
            <Form className="space-y-4">
              <div>
                <Field
                  classNames={{
                    inputWrapper: "border-2 border-gray-300 ",
                  }}
                  as={Input}
                  label="Nhập mật khẩu hiện tại"
                  name="currentPassword"
                  type={isVisible ? "text" : "password"}
                  value={values.currentPassword}
                  onChange={handleChange}
                  variant="bordered"
                  endContent={
                    <button
                      type="button"
                      onClick={() => setIsVisible(!isVisible)}
                      className="focus:outline-none"
                    >
                      {isVisible ? (
                        <EyeSlashFilledIcon className="text-2xl text-default-400" />
                      ) : (
                        <EyeFilledIcon className="text-2xl text-default-400" />
                      )}
                    </button>
                  }
                />
                <ErrorMessage
                  name="currentPassword"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <Button
                type="submit"
                color="primary"
                className="w-full"
                isLoading={confirmChangePassword.isPending}
                isDisabled={confirmChangePassword.isPending}
              >
                {confirmChangePassword.isPending
                  ? "Đang xác minh..."
                  : "Xác minh"}
              </Button>
            </Form>
          )}
        </Formik>
      ) : (
        <Formik
          initialValues={{ newPassword: "", confirmPassword: "" }}
          validationSchema={changeSchema}
          onSubmit={handleChangePassword}
        >
          {({ handleChange, values }) => (
            <Form className="space-y-4">
              <div>
                <Field
                  as={Input}
                  label="Mật khẩu mới"
                  name="newPassword"
                  type="password"
                  value={values.newPassword}
                  onChange={handleChange}
                  variant="bordered"
                />
                <ErrorMessage
                  name="newPassword"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <Field
                  as={Input}
                  label="Xác nhận mật khẩu mới"
                  name="confirmPassword"
                  type="password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  variant="bordered"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <Button
                type="submit"
                color="primary"
                className="w-full"
                isLoading={changePassword.isPending}
                isDisabled={changePassword.isPending}
              >
                {changePassword.isPending ? "Đang đổi..." : "Đổi mật khẩu"}
              </Button>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
}

export default ChangePassword;
