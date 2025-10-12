import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

export default function ConfirmModal({
  isOpen,
  onClose,
  title = "Xác nhận",
  message = "Bạn có chắc chắn muốn thực hiện hành động này?",
  confirmText = "Đồng ý",
  cancelText = "Hủy",
  onConfirm,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      classNames={{
        backdrop: "bg-black/15",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
        <ModalBody>
          <p className="text-gray-600">{message}</p>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            {cancelText}
          </Button>
          <Button
            color="primary"
            onPress={() => {
              onConfirm?.();
              onClose();
            }}
          >
            {confirmText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
