import { createPortal } from "react-dom";
import Button from "../Button";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  isProcessing = false,
  id,
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed top-0 left-0 w-screen h-screen z-[9999] bg-black/70 flex items-center justify-center">
      <div className="relative py-8 px-9 bg-white rounded-lg shadow-xl w-96">
        <button
          className="absolute top-3 right-4 text-3xl text-black"
          onClick={onClose}
        >
          ×
        </button>

        <h2 className="text-lg font-semibold text-black mb-2">
          {title}
        </h2>

        <p className="text-grey-4">{message}</p>

        <div className="flex justify-center mt-6 gap-3">
          <Button
            className="py-2 px-5 border-2 bg-[#F5F7F5] text-primary rounded-full"
            onClick={onClose}
            disabled={isProcessing}
          >
            {cancelText}
          </Button>

          <Button onClick={() => onConfirm(id)} disabled={isProcessing}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmationModal;