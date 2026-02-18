import { useState, useCallback, useEffect } from "react";
import { X, Upload, Image, Trash2 } from "lucide-react";
import Button from "../Button";
import { ClipLoader } from "react-spinners";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const CreateSubCommunityModal = ({
  isOpen,
  onClose,
  onSave,
  isLoading = false,
  parentCommunityId,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "active",
    location: "",
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [showMap, setShowMap] = useState(true);
  const [mapCenter, setMapCenter] = useState({ lat: 28.6139, lng: 77.2090 });
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [inputRef, setInputRef] = useState(null);
  
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

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

  // Initialize autocomplete
  useEffect(() => {
    if (isLoaded && inputRef && !autocomplete) {
      console.log('Initializing autocomplete...');
      console.log('Google Maps loaded:', !!window.google?.maps);
      console.log('Input ref:', inputRef);
      
      try {
        const autocompleteInstance = new window.google.maps.places.Autocomplete(inputRef, {
          fields: ["formatted_address", "geometry", "name"],
        });

        console.log('Autocomplete instance created:', autocompleteInstance);

        autocompleteInstance.addListener("place_changed", () => {
          const place = autocompleteInstance.getPlace();
          console.log('Place selected:', place);
          if (place.geometry) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            setSelectedPosition({ lat, lng });
            setMapCenter({ lat, lng });
            const address = place.formatted_address || place.name;
            setFormData(prev => ({ ...prev, location: address }));
            if (inputRef) {
              inputRef.value = address;
            }
          }
        });

        setAutocomplete(autocompleteInstance);
      } catch (error) {
        console.error('Error initializing autocomplete:', error);
      }
    }
  }, [isLoaded, inputRef, autocomplete]);

  // Fix autocomplete dropdown z-index
  useEffect(() => {
    if (isLoaded) {
      const style = document.createElement('style');
      style.innerHTML = '.pac-container { z-index: 10000 !important; }';
      document.head.appendChild(style);
      return () => document.head.removeChild(style);
    }
  }, [isLoaded]);

  // Handle map click
  const handleMapClick = (event) => {
    if (!isLoaded || !window.google?.maps) return;

    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setSelectedPosition({ lat, lng });

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results?.[0]) {
        const address = results[0].formatted_address;
        handleInputChange("location", address);
      }
    });
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setSelectedPosition({ lat, lng });
        setMapCenter({ lat, lng });
        handleMapClick({ latLng: { lat: () => lat, lng: () => lng } });
      });
    }
  };

  // Handle image selection
  const handleImageSelect = useCallback(
    (e) => {
      const files = Array.from(e.target.files);
      const newImages = [];
      const newPreviews = [];

      files.forEach((file) => {
        if (
          file.type.startsWith("image/") &&
          images.length + newImages.length < 20
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
        parentCommunity: parentCommunityId,
      });
    },
    [formData, images, onSave, validateForm, parentCommunityId]
  );

  // Cleanup image previews on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-60 p-4">
      <div className="w-2/5 bg-white rounded-2xl shadow-2xl  max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 px-8 py-6 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Create New Sub-Community
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
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="space-y-6">
              {/* Community Name */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Community Name *
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
                  Description *
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

              {/* Status */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Location Field */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Location
                </label>
                <input
                  ref={setInputRef}
                  defaultValue={formData.location}
                  onBlur={(e) => handleInputChange("location", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                  placeholder="Type location or use map below"
                />
                {isLoaded && (
                  <div className="bg-white border rounded-lg shadow-sm p-2">
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded mb-2 text-sm text-blue-600"
                    >
                      📍 Use my current location
                    </button>
                    <div className="h-64 w-full rounded-lg overflow-hidden">
                      <GoogleMap
                        center={mapCenter}
                        zoom={14}
                        mapContainerStyle={{ width: "100%", height: "100%" }}
                        onClick={handleMapClick}
                      >
                        {selectedPosition && <Marker position={selectedPosition} />}
                      </GoogleMap>
                    </div>
                  </div>
                )}
              </div>

              {/* Images Upload */}
              <div>
                <label className="block mb-3 text-sm font-semibold text-gray-700">
                  Community Images (Max 20)
                </label>
                <div className="p-8 text-center transition-colors border-2 border-gray-300 border-dashed rounded-2xl hover:border-gray-400">
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
                    className={`cursor-pointer inline-flex items-center gap-3 px-6 py-4 rounded-xl font-medium transition-all ${
                      images.length >= 20 || isLoading
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                    }`}
                  >
                    <Upload className="w-5 h-5" />
                    {images.length >= 20
                      ? "Maximum images reached"
                      : `Add images (${images.length}/20)`}
                  </label>
                </div>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 mt-6 sm:grid-cols-3 md:grid-cols-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="object-cover w-full h-24 rounded-xl"
                        />
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
                  <Image className="w-4 h-4" />
                )}
                {isLoading ? "Creating..." : "Create Community"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSubCommunityModal;
