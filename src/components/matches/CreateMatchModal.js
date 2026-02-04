import { useState, useEffect, useCallback } from "react";
import Button from "../Button";
import { ClipLoader } from "react-spinners";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

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

const SKILLS = ["A", "B+", "B", "B-", "C-", "C", "C strong", "C+", "D", "D+"];

const CreateMatchModal = ({
  subCommunities,
  isOpen,
  onClose,
  onSave,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [showMap, setShowMap] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 28.6139, lng: 77.2090 });
  const [selectedPosition, setSelectedPosition] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(EMPTY_FORM);
    }
  }, [isOpen]);

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setSelectedPosition({ lat, lng });
    
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        handleChange('location', results[0].formatted_address);
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
  }, []);

  const toggleSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skillRange: prev.skillRange.includes(skill)
        ? prev.skillRange.filter((s) => s !== skill)
        : [...prev.skillRange, skill],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  const inputStyle =
    "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 px-6 py-4 bg-white border-b rounded-t-lg">
          <h2 className="text-xl font-semibold text-gray-900">Create Match</h2>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          <Field label="Match Name">
            <input
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={inputStyle}
              placeholder="Enter match name"
            />
          </Field>

          <Field label="Sub Community">
            <select
              value={formData.subCommunity?._id || ""}
              onChange={(e) => {
                const selected = subCommunities.find(
                  (item) => item._id === e.target.value,
                );
                handleChange("subCommunity", selected || {});
              }}
              className={inputStyle}
            >
              <option value="">Select</option>
              {Array.isArray(subCommunities) &&
              subCommunities.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}

            </select>
          </Field>

          <Field label="Match Duration">
            <select
              value={formData.duration}
              onChange={(e) => handleChange("duration", e.target.value)}
              className={inputStyle}
            >
              <option value="">Select</option>
              <option>30 mins</option>
              <option>60 mins</option>
              <option>90 mins</option>
            </select>
          </Field>

          <Field label="Match Type">
            <select
              value={formData.matchType}
              onChange={(e) => handleChange("matchType", e.target.value)}
              className={inputStyle}
            >
              <option value="">Select</option>
              <option>Verified</option>
              <option>Unverified</option>
            </select>
            {formData.matchType === "Verified" && (
              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ This match requires verification. User will be redirected to complete the verification process.
                </p>
              </div>
            )}
          </Field>

          <Field label="Match Mode">
            <select
              value={formData.matchMode}
              onChange={(e) => handleChange("matchMode", e.target.value)}
              className={inputStyle}
            >
              <option value="">Select</option>
              <option value={"social"}>Social</option>
              <option value={"competitive"}>Competitive</option>
              <option value={"league"}>League</option>
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

          <div className="grid grid-cols-3 gap-3">
            <Field label="Date">
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                className={inputStyle}
              />
            </Field>

            <Field label="Start Time">
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => {
                  handleChange("startTime", e.target.value);
                }}
                className={inputStyle}
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

          <Field label="Max Players">
            <input
              type="number"
              value={formData.maxPlayers}
              onChange={(e) => handleChange("maxPlayers", e.target.value)}
              className={inputStyle}
              placeholder="16"
            />
          </Field>

          <Field label="Price">
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => handleChange("price", e.target.value)}
              className={inputStyle}
              placeholder="0.00"
            />
          </Field>

          <Field label="Match Location">
            <div className="relative">
              <input
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                onClick={() => setShowMap(!showMap)}
                className={`${inputStyle} min-h-[60px] bg-gray-50 text-gray-600 cursor-pointer`}
                placeholder="Dubai, United Arab Emirates Sheikh Zayed Road, Al Quoz 1, 12345"
                readOnly
              />
              {showMap && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-10">
                  <div className="p-3 space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        getCurrentLocation();
                        setShowMap(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center gap-2"
                    >
                      📍 Use my current location
                    </button>
                    <input
                      type="text"
                      placeholder="Add manually"
                      className="w-full px-3 py-2 border rounded"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleChange('location', e.target.value);
                          setShowMap(false);
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </Field>

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

const Field = ({ label, children }) => (
  <div className="flex flex-col space-y-1">
    <label className="text-sm font-medium text-gray-900">
      {label} <span className="text-red-500">*</span>
    </label>
    {children}
  </div>
);

export default CreateMatchModal;