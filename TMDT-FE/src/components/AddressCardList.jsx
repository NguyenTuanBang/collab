import { Card, CardHeader, CardBody, useDisclosure } from "@heroui/react";
import useAdress from "../hooks/useAdress";
import useToast from "../hooks/useToast";
import ConfirmModal from "./ConfirmModal";
import UpdateAddressModal from "./UpdateAddressModal";
import { useState } from "react";

export default function AdressCardList() {
  const {
    address,
    isLoading,
    isError,
    deleteAddress,
    setDefaultAddress,
    updateAddress,
  } = useAdress();
  const toast = useToast();

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const {
    isOpen: isUpdateOpen,
    onOpen: onUpdateOpen,
    onClose: onUpdateClose,
  } = useDisclosure();

  const [selectedAddress, setSelectedAddress] = useState(null);

  if (isLoading) return <p>Đang tải địa chỉ...</p>;
  if (isError) return <p>Có lỗi khi tải địa chỉ</p>;
  if (!address || address.length === 0) return <p>Bạn chưa có địa chỉ nào.</p>;

  return (
    <div>
      {address.map((add) => {
        return (
          <Card
            key={add._id}
            className="shadow-none rounded-none border-b border-gray-400 pb-4 mb-4"
          >
            <CardHeader className="flex justify-between items-center">
              <div className="flex justify-center gap-2 items-center">
                <p className="font-semibold text-xl">{add.name}</p>
                <span className="mx-2 h-4 border-1 border-gray-400"></span>
                <p className="text-lg text-gray-500">{add.phone}</p>
                {add.isDefault && (
                  <span className="text-sm px-2 py-1 bg-green-100 text-green-600 rounded">
                    Mặc định
                  </span>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedAddress(add);
                    onUpdateOpen();
                  }}
                  className="px-3 py-1.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg 
               hover:bg-gray-100 hover:text-gray-800 transition-colors cursor-pointer"
                >
                  Cập nhật
                </button>

                {!add.isDefault && (
                  <>
                    <button
                      onClick={() => {
                        setDefaultAddress.mutate(add._id, {
                          onSuccess: () => {
                            toast.success(
                              "Thành công",
                              "Đã thay đổi địa chỉ mặc định"
                            );
                          },
                        });
                      }}
                      className="cursor-pointer px-3 py-1.5 text-sm font-medium text-blue-600 border border-blue-400 rounded-lg 
                 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    >
                      Thiết lập mặc định
                    </button>

                    <>
                      <button
                        onClick={onDeleteOpen}
                        className="cursor-pointer px-3 py-1.5 text-sm font-medium text-red-600 border border-red-400 rounded-lg 
               hover:bg-red-50 hover:text-red-700 transition-colors"
                      >
                        Xóa
                      </button>

                      <ConfirmModal
                        isOpen={isDeleteOpen}
                        onClose={onDeleteClose}
                        title="Xóa địa chỉ"
                        message="Bạn có chắc chắn muốn xóa địa chỉ này không?"
                        confirmText="Xóa"
                        cancelText="Hủy"
                        onConfirm={() =>
                          deleteAddress.mutate(add._id, {
                            onSuccess: () => {
                              toast.success("Thành công", "Đã xóa địa chỉ");
                            },
                          })
                        }
                      />
                    </>
                  </>
                )}
              </div>
            </CardHeader>

            <CardBody>
              <p className="text-gray-500">{add.detail}</p>
              <p className="text-gray-500">
                {add.ward}, {add.district}, {add.province}
              </p>
            </CardBody>
          </Card>
        );
      })}

      <UpdateAddressModal
        isOpen={isUpdateOpen}
        onClose={onUpdateClose}
        initialData={selectedAddress}
        onSubmit={(values) => {
          updateAddress.mutate(
            { id: selectedAddress._id, ...values },
            {
              onSuccess: () => {
                toast.success("Thành công", "Đã cập nhật địa chỉ");
              },
              onError: () => {
                console.log(values);
              },
            }
          );
        }}
      />
    </div>
  );
}
