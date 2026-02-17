import { useState, useCallback, useEffect } from "react";
import Button from "../Button";
import { ClipLoader } from "react-spinners";
import { X, Upload, Image as ImageIcon, Trash2 } from "lucide-react";

const EditSubCommunityModal = ({
  isOpen,
  onClose,
  onSave,
  title,
  initialData = {},
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "active",
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        status: initialData.status || "active",
      });
      setImages([]);
      setImagePreviews([]);
      setErrors({});
    }
  }, [isOpen, initialData]);

  const handleInputChange = useCallback(
    (key, value) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
      if (errors[key]) {
        setErrors((prev) => ({ ...prev, [key]: "" }));
      }
    },
    [errors]
  );

  const handleImageSelect = useCallback(
    (e) => {
      const files = Array.from(e.target.files);
      const newImages = [];
      const newPreviews = [];

      files.forEach((file) => {
        if (
          file.type.startsWith("image/") &&
          images.length + newImages.length <= 20
        ) {
          newImages.push(file);
          newPreviews.push(URL.createObjectURL(file));
        }
      });

      setImages((prev) => [...prev, ...newImages]);
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    },
    [images.length]
  );

  const removeImage = useCallback((index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      const preview = prev[index];
      if (preview) URL.revokeObjectURL(preview);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Community name is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Name must be at least 3 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      if (!validateForm()) return;

      onSave({
        ...formData,
        images: images.length > 0 ? images : null, // Send new images or null if none added
      });
    },
    [formData, images, onSave, validateForm]
  );

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-500 bg-opacity-70">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 px-6 py-4 bg-white border-b rounded-t-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-black-1">{title}</h2>
            <button
              className="text-2xl text-gray-500 hover:text-gray-700"
              onClick={() => {
                setErrors({});
                onClose();
              }}
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6 space-y-6">
            {/* Community Name */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Community Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                  errors.title ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter community name"
                disabled={isLoading}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-vertical ${
                  errors.description ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Describe your community..."
                disabled={isLoading}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                disabled={isLoading}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Images Upload */}
            <div>
              <label className="block mb-3 text-sm font-medium text-gray-700">
                Community Images (Max 20)
              </label>
              <div className="p-6 text-center transition-colors border-2 border-gray-300 border-dashed rounded-xl hover:border-gray-400">
                <input
                  id="image-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  disabled={images.length >= 20 || isLoading}
                />
                <label
                  htmlFor="image-upload"
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium cursor-pointer transition-all ${
                    images.length >= 20 || isLoading
                      ? "text-gray-400 cursor-not-allowed bg-gray-100"
                      : "text-primary hover:bg-primary/10 hover:text-primary/90"
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  {images.length >= 20
                    ? "Max reached"
                    : `Add images (${images.length}/20)`}
                </label>
              </div>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="object-cover w-full h-20 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute flex items-center justify-center w-6 h-6 text-xs text-white transition-all bg-red-500 rounded-full opacity-0 -top-2 -right-2 hover:bg-red-600 group-hover:opacity-100"
                        disabled={isLoading}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4 space-x-3 border-t">
            <Button
              type="button"
              className="py-2 px-6 border-2 bg-[#F5F7F5] text-primary rounded-full"
              onClick={() => {
                setErrors({});
                onClose();
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2"
            >
              {isLoading ? (
                <ClipLoader color="white" size={20} />
              ) : (
                <>
                  <ImageIcon className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSubCommunityModal;
