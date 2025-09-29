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
  formId,
}) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
        <ModalBody>{children}</ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            {cancelText}
          </Button>
          <Button color="primary" type="submit" form={formId}>
            {confirmText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}