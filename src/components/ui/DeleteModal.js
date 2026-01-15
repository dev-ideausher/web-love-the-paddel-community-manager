// components/ui/DeleteModal.jsx
import { ClipLoader } from "react-spinners";
import Button from "../Button";

const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete this item?",
  message = "Are you sure you want to delete this item?",
  isProcessing = false,
  confirmText = "Yes, delete",
  cancelText = "No",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-70">
      <div className="py-8 bg-white rounded-lg shadow-lg px-9 w-96">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-black-1">{title}</h2>
          <button
            className="text-black text-3xl flex mt-[-30px] justify-end"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <p className="mt-2 text-grey-4">{message}</p>

        <div className="flex justify-center mt-5 space-x-3">
          <Button
            className="py-2 px-5 border-2 bg-[#F5F7F5] text-primary rounded-full"
            onClick={onClose}
          >
            {cancelText}
          </Button>
          <Button onClick={onConfirm} disabled={isProcessing}>
            {isProcessing ? (
              <ClipLoader color="white" size={20} />
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
