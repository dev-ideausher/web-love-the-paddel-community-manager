import { useState, useEffect, useCallback } from "react";
import Button from "../Button";
import { ClipLoader } from "react-spinners";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const EMPTY_FORM = {
  name: "",
  subCommunity: "",
  duration: "",
  matchType: "",
  matchMode: "",
  skillRange: [],
  date: "",
  startTime: "",
  endTime: "",
  time: "",
  maxPlayers: "",
  price: "",
  location: "",
};

const SKILLS = ["E", "D", "D+", "C-", "C+", "B-", "B", "B+", "A"];

const CreateMatchModal = ({
  subCommunities = [],
  isOpen,
  onClose,
  onSave,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [showMap, setShowMap] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 28.6139, lng: 77.2090 });
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [locationDetails, setLocationDetails] = useState({
    formattedAddress: "",
    city: "",
    state: "",
    postalCode: "",
    country: ""
  });
  
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  useEffect(() => {
    if (isOpen) {
      setFormData(EMPTY_FORM);
      setErrors({});
      // Reset location details when modal opens
      setLocationDetails({
        formattedAddress: "",
        city: "",
        state: "",
        postalCode: "",
        country: ""
      });
    }
  }, [isOpen]);

  const handleMapClick = (event) => {
    if (!isLoaded || !window.google?.maps) return;

    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setSelectedPosition({ lat, lng });

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results?.[0]) {
        const address = results[0].formatted_address;
        
        // Parse address components for city, state, etc.
        let city = "";
        let state = "";
        let postalCode = "";
        let country = "";
        
        results[0].address_components.forEach(component => {
          if (component.types.includes("locality")) {
            city = component.long_name;
          }
          if (component.types.includes("administrative_area_level_1")) {
            state = component.long_name;
          }
          if (component.types.includes("postal_code")) {
            postalCode = component.long_name;
          }
          if (component.types.includes("country")) {
            country = component.long_name;
          }
        });
        
        // Store location details in state for later use in the payload
        setLocationDetails({
          formattedAddress: address,
          city,
          state,
          postalCode,
          country
        });
        
        handleChange("location", address);
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

  const handleChange = useCallback((key, value) => {
    setFormData((prev) => {
      const newData = { ...prev, [key]: value };
      
      if ((key === 'startTime' || key === 'duration') && newData.startTime && newData.duration) {
        const durationMinutes = parseInt(newData.duration.split(' ')[0]);
        const [hours, minutes] = newData.startTime.split(':').map(Number);
        const startDate = new Date();
        startDate.setHours(hours, minutes, 0, 0);
        const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
        newData.endTime = endDate.toTimeString().slice(0, 5);
      }
      
      return newData;
    });
    
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: "" }));
    }
  }, [errors]);

  const toggleSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skillRange: prev.skillRange.includes(skill)
        ? prev.skillRange.filter((s) => s !== skill)
        : [...prev.skillRange, skill],
    }));
  };

  const durationMap = {
    "30 mins": "30mins",
    "60 mins": "60mins",
    "90 mins": "90mins",
    "24 hours": "24hours",
    "48 hours": "48hours",
  };
  
const handleSubmit = (e) => {
  e.preventDefault();

  const newErrors = {};
  
  if (!formData.name.trim()) newErrors.name = "Match name is required";
  if (!formData.subCommunity) newErrors.subCommunity = "Sub community is required";
  if (!formData.duration) newErrors.duration = "Duration is required";
  if (!formData.matchType) newErrors.matchType = "Match type is required";
  if (!formData.matchMode) newErrors.matchMode = "Match mode is required";
  if (!formData.date) newErrors.date = "Date is required";
  if (!formData.startTime) newErrors.startTime = "Start time is required";
  if (!formData.maxPlayers) newErrors.maxPlayers = "Max players is required";
  if (!formData.price) newErrors.price = "Price is required";
  if (!formData.location) newErrors.location = "Location is required";
  
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  const dateStr = formData.date.split("T")[0];
  const lng = selectedPosition?.lng || 0;
  const lat = selectedPosition?.lat || 0;

  const apiPayload = {
    name: formData.name,
    description: formData.name,
    community: formData.subCommunity,
    location: {
      streetAddress: locationDetails.formattedAddress || formData.location || "Default Location",
      country: locationDetails.country || "Delhi",
      city: locationDetails.city || "Akshardham",
      state: locationDetails.state || "Delhi",
      postalCode: locationDetails.postalCode || "201301",
      position: {
        type: "Point",
        coordinates: [lng, lat],
      },
    },
    date: new Date(dateStr).toISOString(),
    startTime: new Date(`${dateStr}T${formData.startTime}:00`).toISOString(),
    endTime: new Date(`${dateStr}T${formData.endTime}:00`).toISOString(),
    matchMode: formData.matchMode,
    currentVerificationStatus: formData.matchType,
    skills: formData.skillRange,
    duration: durationMap[formData.duration],
    playersRequired: Number(formData.maxPlayers),
    price: Number(formData.price),
    cancellationPolicy: [
      "Cancellation allowed up to 24 hours before match",
      "No refund for same-day cancellation",
    ],
  };

  console.log('Sending API-compatible payload:', apiPayload);
  onSave(apiPayload);
};
    
  if (!isOpen) return null;

  const inputStyle =
    "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="sticky top-0 px-6 py-4 bg-white border-b rounded-t-lg">
          <h2 className="text-xl font-semibold text-gray-900">Create Match</h2>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4 overflow-y-auto flex-1">
          <Field label="Match Name" error={errors.name}>
            <input
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={`${inputStyle} ${errors.name ? 'border-red-300' : ''}`}
              placeholder="Enter match name"
            />
          </Field>

          <Field label="Sub Community" error={errors.subCommunity}>
            <select
              value={formData.subCommunity || ""}
              onChange={(e) => handleChange("subCommunity", e.target.value)}
              className={`${inputStyle} ${errors.subCommunity ? 'border-red-300' : ''}`}
            >
              <option value="">Select</option>
              {Array.isArray(subCommunities) && subCommunities.map((community) => (
                <option key={community._id} value={community._id}>
                  {community.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Match Duration" error={errors.duration}>
            <select
              value={formData.duration}
              onChange={(e) => handleChange("duration", e.target.value)}
              className={`${inputStyle} ${errors.duration ? 'border-red-300' : ''}`}
            >
              <option value="">Select</option>
              <option>30 mins</option>
              <option>60 mins</option>
              <option>90 mins</option>
              <option>24 hours</option>
              <option>48 hours</option>
            </select>
          </Field>

          <Field label="Match Type" error={errors.matchType}>
            <select
              value={formData.matchType}
              onChange={(e) => handleChange("matchType", e.target.value)}
              className={`${inputStyle} ${errors.matchType ? 'border-red-300' : ''}`}
            >
              <option value="">Select</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>
            {formData.matchType === "verified" && (
              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ This match requires verification. User will be redirected to complete the verification process.
                </p>
              </div>
            )}
          </Field>

          <Field label="Match Mode" error={errors.matchMode}>
            <select
              value={formData.matchMode}
              onChange={(e) => handleChange("matchMode", e.target.value)}
              className={`${inputStyle} ${errors.matchMode ? 'border-red-300' : ''}`}
            >
              <option value="friendly">Friendly</option>
              <option value="matchplay">Match Play</option>
              <option value="social">Social</option>
              <option value="league">League</option>

            </select>
          </Field>

          <Field label="Skill Level Range">
            <div className="flex flex-wrap gap-2">
              {SKILLS.map((skill) => {
                const selected = formData.skillRange.includes(skill);

                return (
                  <button
                    type="button"
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition
                      ${
                        selected
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="Date" error={errors.date}>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
              className={`${inputStyle} ${errors.date ? 'border-red-300' : ''}`}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Start Time" error={errors.startTime}>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => {
                  handleChange("startTime", e.target.value);
                }}
                className={`${inputStyle} ${errors.startTime ? 'border-red-300' : ''}`}
              />
            </Field>

            <Field label="End Time">
              <input
                type="time"
                value={formData.endTime}
                readOnly
                className={`${inputStyle} bg-gray-50`}
              />
            </Field>
          </div>

          <Field label="Max Players" error={errors.maxPlayers}>
            <input
              type="number"
              value={formData.maxPlayers}
              onChange={(e) => handleChange("maxPlayers", e.target.value)}
              className={`${inputStyle} ${errors.maxPlayers ? 'border-red-300' : ''}`}
              placeholder="16"
            />
          </Field>

          <Field label="Price" error={errors.price}>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">AED</span>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleChange("price", e.target.value)}
                className={`${inputStyle} pl-14 ${errors.price ? 'border-red-300' : ''}`}
                placeholder="0.00"
              />
            </div>
          </Field>

          <Field label="Match Location" error={errors.location}>
            <div className="relative">
              <input
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                onClick={() => setShowMap(!showMap)}
                className={`${inputStyle} min-h-[60px] bg-gray-50 text-gray-600 cursor-pointer ${errors.location ? 'border-red-300' : ''}`}
                placeholder="Click to select location on map"
                readOnly
              />
            </div>
          </Field>

          {showMap && isLoaded && (
            <div className="bg-white border rounded-lg shadow-lg p-2 -mt-2">
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
              <button
                type="button"
                onClick={() => setShowMap(false)}
                className="w-full mt-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
              >
                Close Map
              </button>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 text-gray-900 bg-gray-100 rounded-full"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-full"
            >
              {isLoading ? <ClipLoader size={18} color="white" /> : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Field = ({ label, children, error }) => (
  <div className="flex flex-col space-y-1">
    <label className="text-sm font-medium text-gray-900">
      {label} <span className="text-red-500">*</span>
    </label>
    {children}
    {error && <p className="text-xs text-red-600">{error}</p>}
  </div>
);

export default CreateMatchModal;