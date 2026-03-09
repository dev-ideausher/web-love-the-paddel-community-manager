import { useState, useCallback, useEffect } from "react";
import Button from "../Button";
import { ClipLoader } from "react-spinners";
import { X, Upload, Image as ImageIcon, Trash2 } from "lucide-react";
import { getSubCommunitiesList } from "@/services/subCommunityServices";

const announcementTypes = [
  { value: "GENERAL", label: "General" },
  { value: "ANNOUNCEMENT", label: "Announcement" },
  { value: "EVENT", label: "Event" },
  { value: "TOURNAMENT", label: "Tournament" },
];

const EditAnnouncementModal = ({
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
    subCommunity: "",
    images: [],
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [subCommunities, setSubCommunities] = useState([]);
  const [loadingSubCommunities, setLoadingSubCommunities] = useState(false);

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen && initialData) {
      const existingImgs = Array.isArray(initialData.images) ? initialData.images : [];
      
      setFormData((prev) => ({
        ...prev,
        title: initialData.title || "",
        description: initialData.description || "",
        subCommunity:
          initialData.subCommunity && typeof initialData.subCommunity === "object"
            ? initialData.subCommunity._id || initialData.subCommunity.id || ""
            : initialData.subCommunity || "",
        images: existingImgs,
      }));
      setExistingImages(existingImgs);
      setImages([]);
      setImagePreviews([]);
      setErrors({});
    }
  }, [isOpen, initialData]);

  // Fetch sub-communities when modal opens (so the select has real options)
  useEffect(() => {
    let mounted = true;
    const fetchSubCommunities = async () => {
      setLoadingSubCommunities(true);
      try {
        const resp = await getSubCommunitiesList({ limit: 100 });
        if (!mounted) return;
        if (resp?.status && resp?.data) {
          const dataArray = Array.isArray(resp.data.results)
            ? resp.data.results
            : Array.isArray(resp.data)
            ? resp.data
            : [];
          setSubCommunities(dataArray);
        } else {
          setSubCommunities([]);
        }
      } catch (err) {
        console.error("Failed to load sub-communities:", err);
        setSubCommunities([]);
      } finally {
        if (mounted) setLoadingSubCommunities(false);
      }
    };

    if (isOpen) fetchSubCommunities();
    return () => {
      mounted = false;
    };
  }, [isOpen]);

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
      const totalCount = existingImages.length + images.length;

      files.forEach((file) => {
        if (
          file.type.startsWith("image/") &&
          totalCount + newImages.length < 20
        ) {
          newImages.push(file);
          newPreviews.push(URL.createObjectURL(file));
        }
      });

      setImages((prev) => [...prev, ...newImages]);
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    },
    [images.length, existingImages.length]
  );

  const removeImage = useCallback((index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      const preview = prev[index];
      if (preview) URL.revokeObjectURL(preview);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const removeExistingImage = useCallback((index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Announcement name is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Name must be at least 3 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (!formData.subCommunity || formData.subCommunity === "") {
      newErrors.subCommunity = "Sub community is required";
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
        images,
        existingImages,
      });
    },
    [formData, images, onSave, validateForm]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-500 bg-opacity-70">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 px-6 py-4 bg-white rounded-t-lg">
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
            {/* Announcement Name */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Announcement Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                  errors.title ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter announcement name"
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
                placeholder="Describe your announcement..."
                disabled={isLoading}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Sub Community */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Community <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.subCommunity}
                onChange={(e) => handleInputChange("subCommunity", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                  errors.subCommunity ? "border-red-300" : "border-gray-300"
                }`}
                disabled={isLoading}
              >
                <option value="">Select sub-community</option>
                {Array.isArray(subCommunities) &&
                  subCommunities.map((sc) => (
                    <option key={sc._id || sc.id} value={sc._id || sc.id}>
                      {sc.name || sc.title || sc}
                    </option>
                  ))}
              </select>
              {errors.subCommunity && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.subCommunity}
                </p>
              )}
            </div>

            {/* Images Upload */}
            <div>
              <label className="block mb-3 text-sm font-medium text-gray-700">
                Announcement Images (Max 20)
              </label>
              <div className="p-6 text-center transition-colors border-2 border-gray-300 border-dashed rounded-xl hover:border-gray-400">
                <input
                  id="image-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  disabled={existingImages.length + images.length >= 20 || isLoading}
                />
                <label
                  htmlFor="image-upload"
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium cursor-pointer transition-all ${
                    existingImages.length + images.length >= 20 || isLoading
                      ? "text-gray-400 cursor-not-allowed bg-gray-100"
                      : "text-primary hover:bg-primary/10 hover:text-primary/90"
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  {existingImages.length + images.length >= 20
                    ? "Max reached"
                    : `Add images (${existingImages.length + images.length}/20)`}
                </label>
              </div>

              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {existingImages.map((img, index) => (
                    <div key={`existing-${index}`} className="relative group">
                      <img
                        src={typeof img === 'string' ? img : img.url || img}
                        alt={`Existing ${index + 1}`}
                        className="object-cover w-full h-20 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute flex items-center justify-center w-6 h-6 text-xs text-white transition-all bg-red-500 rounded-full opacity-0 -top-2 -right-2 hover:bg-red-600 group-hover:opacity-100"
                        disabled={isLoading}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* New Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={`new-${index}`} className="relative group">
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

export default EditAnnouncementModal;
