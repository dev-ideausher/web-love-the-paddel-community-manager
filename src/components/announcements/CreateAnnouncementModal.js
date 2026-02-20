import { useState, useCallback, useEffect } from "react";
import { X, Upload, ImageIcon, Trash2 } from "lucide-react";
import Button from "../Button";
import { ClipLoader } from "react-spinners";
import { getSubCommunitiesList } from "@/services/subCommunityServices";

const announcementTypes = [
  { value: "GENERAL", label: "General" },
  { value: "ANNOUNCEMENT", label: "Announcement" },
  { value: "EVENT", label: "Event" },
  { value: "TOURNAMENT", label: "Tournament" },
];
const CreateAnnouncementModal = ({
  isOpen,
  onClose,
  onSave,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subCommunity: "",
    svgType: "",
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [subCommunities, setSubCommunities] = useState([]);
  const [loadingSubCommunities, setLoadingSubCommunities] = useState(false);

  // Handle form input changes
  const handleInputChange = useCallback(
    (key, value) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
      if (errors[key]) {
        setErrors((prev) => ({ ...prev, [key]: "" }));
      }
    },
    [errors]
  );

  // Compress image
  const compressImage = (file, maxSizeMB = 1) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDimension = 1920;
          
          if (width > height && width > maxDimension) {
            height = (height * maxDimension) / width;
            width = maxDimension;
          } else if (height > maxDimension) {
            width = (width * maxDimension) / height;
            height = maxDimension;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            resolve(new File([blob], file.name, { type: 'image/jpeg' }));
          }, 'image/jpeg', 0.8);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle image/video selection
  const handleImageSelect = useCallback(
    async (e) => {
      const files = Array.from(e.target.files);
      const newImages = [];
      const newPreviews = [];
      const maxVideoSize = 50 * 1024 * 1024; // 50MB for videos
      const maxImageSize = 10 * 1024 * 1024; // 10MB for images

      for (const file of files) {
        if (images.length + newImages.length < 20) {
          if (file.type.startsWith("image/")) {
            if (file.size > maxImageSize) {
              alert(`Image "${file.name}" is too large. Maximum size is 10MB.`);
              continue;
            }
            const compressed = await compressImage(file);
            newImages.push(compressed);
            newPreviews.push(URL.createObjectURL(compressed));
          } else if (file.type.startsWith("video/")) {
            if (file.size > maxVideoSize) {
              alert(`Video "${file.name}" is too large. Maximum size is 50MB.`);
              continue;
            }
            newImages.push(file);
            newPreviews.push(URL.createObjectURL(file));
          }
        }
      }

      setImages((prev) => [...prev, ...newImages]);
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    },
    [images.length]
  );

  // Remove image
  const removeImage = useCallback((index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      const newPreviews = prev.filter((_, i) => i !== index);
      // Cleanup revoked URLs
      prev[index] && URL.revokeObjectURL(prev[index]);
      return newPreviews;
    });
  }, []);

  // Validate form
  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Community name is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (formData.title.trim().length < 3) {
      newErrors.title = "Community name must be at least 3 characters";
    }
    if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Handle form submission
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      if (!validateForm()) return;

      onSave({
        ...formData,
        images,
      });
    },
    [formData, images, onSave, validateForm]
  );

  // Fetch sub-communities
  useEffect(() => {
    const fetchSubCommunities = async () => {
      setLoadingSubCommunities(true);
      try {
        const response = await getSubCommunitiesList({ limit: 100 });
        if (response.status && response.data) {
          const dataArray = Array.isArray(response.data.results) 
            ? response.data.results 
            : Array.isArray(response.data) 
            ? response.data 
            : [];
          setSubCommunities(dataArray);
        }
      } catch (error) {
        console.error("Failed to fetch sub-communities:", error);
      } finally {
        setLoadingSubCommunities(false);
      }
    };
    
    if (isOpen) {
      fetchSubCommunities();
    }
  }, [isOpen]);

  // Cleanup image previews on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, []);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({ title: "", description: "", subCommunity: "", svgType: "" });
      setImages([]);
      setImagePreviews([]);
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-60 p-4">
      <div className="w-2/5 bg-white rounded-2xl shadow-2xl  max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 px-8 py-6 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Create announcement
            </h2>
            <button
              onClick={onClose}
              className="p-2 transition-colors rounded-full hover:bg-gray-100"
              disabled={isLoading}
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 p-8 overflow-y-auto" id="create-announcement-form">
          <div className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.title ? "border-red-300" : "border-gray-200"
                }`}
                placeholder="Enter community name"
                disabled={isLoading}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Content *
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className={`w-full px-4 py-3 border rounded-xl resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.description ? "border-red-300" : "border-gray-200"
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
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Sub Community *
              </label>

              <select
                value={formData.subCommunity}
                onChange={(e) =>
                  handleInputChange("subCommunity", e.target.value)
                }
                className={`w-full px-4 py-3 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.subCommunity ? "border-red-300" : "border-gray-200"
                }`}
                disabled={isLoading || loadingSubCommunities}
              >
                <option value="" disabled>
                  {loadingSubCommunities ? "Loading..." : "Select a sub community"}
                </option>

                {subCommunities.map((option) => (
                  <option key={option._id} value={option._id}>
                    {option.name}
                  </option>
                ))}
              </select>

              {errors.subCommunity && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.subCommunity}
                </p>
              )}
            </div>

            {/* Announcement Type */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Announcement Type *
              </label>

              <select
                value={formData.svgType}
                onChange={(e) =>
                  handleInputChange("svgType", e.target.value)
                }
                className={`w-full px-4 py-3 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.svgType ? "border-red-300" : "border-gray-200"
                }`}
                disabled={isLoading}
              >
                <option value="" disabled>
                  Select announcement type
                </option>

                {announcementTypes.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {errors.svgType && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.svgType}
                </p>
              )}
            </div>

            {/* Images/Videos Upload */}
            <div>
              <label className="block mb-3 text-sm font-semibold text-gray-700">
                Media (Images/Videos)
              </label>
              <p className="mb-2 text-xs text-gray-500">
                Max file size: Images 10MB, Videos 50MB
              </p>
              <div className="p-8 text-center transition-colors border-2 border-gray-300 border-dashed rounded-2xl hover:border-gray-400">
                <input
                  id="image-upload"
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  disabled={images.length >= 20 || isLoading}
                />
                <label
                  htmlFor="image-upload"
                  className={`cursor-pointer inline-flex items-center gap-3 px-6 py-4 rounded-xl font-medium transition-all ${
                    images.length >= 20 || isLoading
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  <Upload className="w-5 h-5" />
                  {images.length >= 20
                    ? "Maximum files reached"
                    : `Add media (${images.length}/20)`}
                </label>
              </div>

              {/* Media Previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 gap-3 mt-6 sm:grid-cols-3 md:grid-cols-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      {images[index]?.type.startsWith("video/") ? (
                        <video
                          src={preview}
                          className="object-cover w-full h-24 rounded-xl"
                          controls
                        />
                      ) : (
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="object-cover w-full h-24 rounded-xl"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                        disabled={isLoading}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Footer */}
          <div className="sticky bottom-0 px-8 py-6 bg-white border-t border-gray-200 rounded-3xl">
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                className="px-8 py-3 transition-colors border-[2px] rounded-3xl bg-white border-buttontext text-buttontext  hover:bg-gray-50"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex items-center gap-2 px-8 py-3 text-white transition-colors rounded-3xl bg-buttontext "
                disabled={isLoading}
              >
                {isLoading ? (
                  <ClipLoader color="white" size={20} />
                ) : (
                  <ImageIcon className="w-4 h-4" />
                )}
                {isLoading ? "Creating..." : "Create Announcement"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAnnouncementModal;
