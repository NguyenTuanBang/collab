import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

export default function CustomModal({
  isOpen,
  onClose,
  title,
  children,
  confirmText = "OK",
  cancelText = "Hủy",
  formId, // giữ formId
  onConfirm, // thêm onConfirm
}) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
        <ModalBody>{children}</ModalBody>
        <ModalFooter className="flex justify-end gap-2">
          <Button color="danger" variant="light" onPress={onClose}>
            {cancelText}
          </Button>
          <Button
            color="primary"
            type={formId ? "submit" : "button"} // nếu có formId thì submit form
            form={formId} // gắn formId
            onPress={onConfirm}
          >
            {confirmText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
