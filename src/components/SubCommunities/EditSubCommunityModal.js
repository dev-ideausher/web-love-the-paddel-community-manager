import { useState, useCallback, useEffect } from "react";
import Button from "../Button";
import { ClipLoader } from "react-spinners";
import { X, Upload, Image as ImageIcon, Trash2 } from "lucide-react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

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
    location: "",
    locationCoords: null,
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [socialLinks, setSocialLinks] = useState([
    { platform: "instagram", url: "" },
    { platform: "facebook", url: "" },
    { platform: "x", url: "" },
    { platform: "linkedin", url: "" },
  ]);
  const [errors, setErrors] = useState({});
  const [mapCenter, setMapCenter] = useState({ lat: 28.6139, lng: 77.2090 });
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [inputRef, setInputRef] = useState(null);
  
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        status: initialData.status || "active",
        location: initialData.location || "",
        locationCoords: initialData.locationData?.position?.coordinates 
          ? { lng: initialData.locationData.position.coordinates[0], lat: initialData.locationData.position.coordinates[1] }
          : null,
      });
      // Update input field with location
      if (inputRef && initialData.location) {
        inputRef.value = initialData.location;
      }
      setImages([]);
      // Show existing images as previews
      if (initialData.images && Array.isArray(initialData.images) && initialData.images.length > 0) {
        setImagePreviews(initialData.images);
      } else {
        setImagePreviews([]);
      }
      setProfilePic(null);
      // Show existing profile pic
      if (initialData.profilePic) {
        setProfilePicPreview(initialData.profilePic);
      } else {
        setProfilePicPreview(null);
      }
      // Load existing social links
      if (initialData.socialLinks && Array.isArray(initialData.socialLinks) && initialData.socialLinks.length > 0) {
        const loadedLinks = [
          { platform: "instagram", url: "" },
          { platform: "facebook", url: "" },
          { platform: "x", url: "" },
          { platform: "linkedin", url: "" },
        ];
        initialData.socialLinks.forEach(link => {
          const index = loadedLinks.findIndex(l => l.platform === link.platform);
          if (index !== -1) {
            loadedLinks[index].url = link.url || "";
          }
        });
        setSocialLinks(loadedLinks);
      } else {
        setSocialLinks([
          { platform: "instagram", url: "" },
          { platform: "facebook", url: "" },
          { platform: "x", url: "" },
          { platform: "linkedin", url: "" },
        ]);
      }
      setErrors({});
      if (initialData.locationData?.position?.coordinates) {
        const [lng, lat] = initialData.locationData.position.coordinates;
        setSelectedPosition({ lat, lng });
        setMapCenter({ lat, lng });
      } else {
        setSelectedPosition(null);
        setMapCenter({ lat: 28.6139, lng: 77.2090 });
      }
    }
  }, [isOpen, initialData, inputRef]);

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
      try {
        const autocompleteInstance = new window.google.maps.places.Autocomplete(inputRef, {
          fields: ["formatted_address", "geometry", "name"],
        });

        autocompleteInstance.addListener("place_changed", () => {
          const place = autocompleteInstance.getPlace();
          if (place.geometry) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            setSelectedPosition({ lat, lng });
            setMapCenter({ lat, lng });
            setFormData(prev => ({ ...prev, locationCoords: { lat, lng } }));
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
    setFormData(prev => ({ ...prev, locationCoords: { lat, lng } }));

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
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setSelectedPosition({ lat, lng });
          setMapCenter({ lat, lng });
          setFormData(prev => ({ ...prev, locationCoords: { lat, lng } }));
          
          if (isLoaded && window.google?.maps) {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: { lat, lng } }, (results, status) => {
              if (status === "OK" && results?.[0]) {
                const address = results[0].formatted_address;
                handleInputChange("location", address);
                if (inputRef) {
                  inputRef.value = address;
                }
              }
            });
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Unable to get your location.');
        }
      );
    }
  };

  const handleSocialLinkChange = useCallback((platform, value) => {
    setSocialLinks((prev) =>
      prev.map((link) =>
        link.platform === platform ? { ...link, url: value } : link
      )
    );
  }, []);

  const handleProfilePicSelect = useCallback((e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setProfilePic(file);
      setProfilePicPreview(URL.createObjectURL(file));
    }
  }, []);

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
      // Only revoke if it's a blob URL (newly uploaded), not existing image URLs
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
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
        images: images.length > 0 ? images : null,
        profilePic,
        socialLinks: socialLinks.filter(link => link.url.trim() !== ""),
      });
    },
    [formData, images, profilePic, socialLinks, onSave, validateForm]
  );

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => {
        // Only revoke blob URLs, not existing image URLs
        if (preview && preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview);
        }
      });
      if (profilePicPreview && profilePicPreview.startsWith('blob:')) {
        URL.revokeObjectURL(profilePicPreview);
      }
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

            {/* Profile Picture */}
            <div>
              <label className="block mb-3 text-sm font-medium text-gray-700">
                Profile Picture
              </label>
              <div className="p-6 text-center transition-colors border-2 border-gray-300 border-dashed rounded-xl hover:border-gray-400">
                <input
                  id="profile-pic-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicSelect}
                  className="hidden"
                  disabled={isLoading}
                />
                <label
                  htmlFor="profile-pic-upload"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium cursor-pointer transition-all text-primary hover:bg-primary/10"
                >
                  <Upload className="w-4 h-4" />
                  {profilePic ? "Change profile picture" : "Upload profile picture"}
                </label>
              </div>
              {profilePicPreview && (
                <div className="mt-4">
                  <div className="relative inline-block">
                    <img
                      src={profilePicPreview}
                      alt="Profile preview"
                      className="object-cover w-32 h-32 rounded-full"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setProfilePic(null);
                        setProfilePicPreview(null);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full"
                      disabled={isLoading}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Social Links */}
            <div>
              <label className="block mb-3 text-sm font-medium text-gray-700">
                Social Links
              </label>
              <div className="space-y-3">
                {socialLinks.map((link) => (
                  <div key={link.platform}>
                    <label className="block mb-1 text-xs text-gray-600 capitalize">
                      {link.platform === "x" ? "X (Twitter)" : link.platform}
                    </label>
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => handleSocialLinkChange(link.platform, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder={`https://${link.platform === "x" ? "x.com" : link.platform + ".com"}/yourprofile`}
                      disabled={isLoading}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Location Field */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                ref={setInputRef}
                defaultValue={formData.location}
                onBlur={(e) => handleInputChange("location", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary mb-2"
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
