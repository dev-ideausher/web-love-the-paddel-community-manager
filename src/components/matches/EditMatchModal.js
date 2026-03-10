import { useState, useEffect, useCallback } from "react";
import Button from "../Button";
import { ClipLoader } from "react-spinners";
import { Cross, CrossIcon } from "lucide-react";
import { GoogleMap, Marker, Autocomplete } from "@react-google-maps/api";
import { useGoogleMaps } from "@/contexts/GoogleMapsContext";

const EditMatchModal = ({
  isOpen,
  onClose,
  onSave,
  subCommunitiesData,
  initialData = {},
  isLoading = false,
}) => {
  const [subCommunities, setSubcommunities] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 28.6139, lng: 77.2090 });
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [formData, setFormData] = useState({
    matchName: "",
    subCommunity: {},
    duration: "",
    matchType: "",
    matchMode: "",
    skillRange: [],
    date: "",
    startTime: "",
    endTime: "",
    maxPlayers: "",
    price: "",
    location: {
      address: "",
      lat: null,
      lng: null,
    },
  });
  const { isLoaded } = useGoogleMaps();

  const handleMapClick = (event) => {
    if (!window.google) return;

    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    setSelectedPosition({ lat, lng });
    setMapCenter({ lat, lng });

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results?.[0]) {
        handleChange("location", {
          address: results[0].formatted_address,
          lat,
          lng,
        });
      }
    });
  };

  const onPlaceChanged = () => {
    if (!autocomplete) return;

    const place = autocomplete.getPlace();
    if (!place.geometry) return;

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();

    handleChange("location", {
      address: place.formatted_address,
      lat,
      lng,
    });

    setSelectedPosition({ lat, lng });
    setMapCenter({ lat, lng });
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

  const SKILLS = ["A", "B+", "B", "B-", "C-", "C", "C strong", "C+", "D", "D+"];
  const toggleSkill = (skill) => {
    const newSkillRange = formData.skillRange.includes(skill)
      ? formData.skillRange.filter((s) => s !== skill)
      : [...formData.skillRange, skill];
    handleChange("skillRange", newSkillRange);
  };

  useEffect(() => {
    console.log(initialData);
    setSubcommunities(subCommunitiesData);
    if (isOpen && initialData) {
      const locationData = initialData.location || {};
      const lat = locationData.position?.coordinates?.[1] || null;
      const lng = locationData.position?.coordinates?.[0] || null;
      
      if (lat && lng) {
        setSelectedPosition({ lat, lng });
        setMapCenter({ lat, lng });
      }

      // Map duration from API format to display format
      const durationMap = {
        "30mins": "30 mins",
        "60mins": "60 mins",
        "90mins": "90 mins",
        "24hours": "24 hours",
        "48hours": "48 hours",
      };
      const displayDuration = durationMap[initialData.duration] || initialData.duration || "";
      
      // Extract time from startTime and endTime ISO strings
      const startTimeStr = initialData.startTime || "";
      const endTimeStr = initialData.endTime || "";
      const startTimeValue = startTimeStr ? startTimeStr.slice(11, 16) : "";
      const endTimeValue = endTimeStr ? endTimeStr.slice(11, 16) : "";

      setFormData({
        matchName: initialData.name || "",
        subCommunity: initialData.community || {},
        duration: displayDuration,
        matchType: initialData.currentVerificationStatus || "",
        matchMode: initialData.matchMode || "",
        skillRange: initialData.skills || [],
        date: initialData.date || "",
        startTime: startTimeValue,
        endTime: endTimeValue,
        maxPlayers: initialData.playersRequired || "",
        price: initialData.price || "",
        location: {
          address: locationData.streetAddress || "",
          lat,
          lng,
        },
      });
    }
  }, [isOpen, initialData, subCommunitiesData]);

  const handleChange = useCallback((key, value) => {
    setFormData((prev) => {
      const newData = { ...prev, [key]: value };
      
      // Auto-calculate end time when start time or duration changes
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Map duration from display format to API format
    const durationMap = {
      "30 mins": "30mins",
      "60 mins": "60mins",
      "90 mins": "90mins",
      "24 hours": "24hours",
      "48 hours": "48hours",
    };
    
    // Transform form data to API format
    const apiPayload = {
      name: formData.matchName,
      description: formData.matchName,
      community: formData.subCommunity?._id,
      location: {
        streetAddress: formData.location.address,
        position: {
          type: "Point",
          coordinates: [formData.location.lng, formData.location.lat]
        }
      },
      date: formData.date,
      startTime: `${formData.date.split('T')[0]}T${formData.startTime}:00.000Z`,
      endTime: `${formData.date.split('T')[0]}T${formData.endTime}:00.000Z`,
      playersRequired: parseInt(formData.maxPlayers),
      price: parseFloat(formData.price),
      skills: formData.skillRange,
      matchMode: formData.matchMode,
      duration: durationMap[formData.duration] || formData.duration,
      currentVerificationStatus: formData.matchType,
    };
    
    console.log('Edit match payload:', apiPayload);
    onSave(apiPayload);
  };

  if (!isOpen) return null;

  const inputStyle =
    "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 px-6 py-4 bg-white border-b rounded-t-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-black-1">Edit Match</h2>
            <button
              className="text-2xl text-gray-500 hover:text-gray-700"
              onClick={onClose}
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4 overflow-y-auto flex-1">
          <Field label="Match Name">
            <input
              value={formData.matchName}
              onChange={(e) => handleChange("matchName", e.target.value)}
              className={inputStyle}
              placeholder="Enter match name"
            />
          </Field>

          <Field label="Community">
            <select
              value={formData.subCommunity?._id || ""}
              onChange={(e) => {
                const value = e.target.value;
                const apiSubCommunities = subCommunities?.results || subCommunities || [];
                const selected = apiSubCommunities.find(
                  (item) => item._id === value,
                );
                if (selected) {
                  handleChange("subCommunity", selected);
                }
              }}
              className={inputStyle}
            >
              <option value="">Select</option>
              {(subCommunities?.results || subCommunities || []).map((community) => (
                <option key={community._id} value={community._id}>
                  {community.parentCommunity?.name || community.name}
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
              <option>24 hours</option>
              <option>48 hours</option>
            </select>
          </Field>

          <Field label="Match Type">
            <select
              value={formData.matchType}
              onChange={(e) => handleChange("matchType", e.target.value)}
              className={inputStyle}
            >
              <option value="">Select</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>
          </Field>

          <Field label="Match Mode">
            <select
              value={formData.matchMode}
              onChange={(e) => handleChange("matchMode", e.target.value)}
              className={inputStyle}
            >
              <option value="">Select</option>
              <option value={"social"}>Social</option>
              <option value={"competitive"}>Friendly</option>
              <option value={"league"}>League</option>
              <option value={"matchplay"}>Matchplay</option>
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
                    className={`
            px-3 py-1.5 rounded-full text-sm border transition
            ${
              selected
                ? "bg-black text-white border-black"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }
          `}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="Date">
            {console.log("date", formData.date)}
            <input
              type="date"
              value={formData.date.split("T")[0]}
              onChange={(e) => {
                handleChange("date", e.target.value);
              }}
              className={inputStyle}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
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
              min="1"
              value={formData.maxPlayers}
              onChange={(e) => handleChange("maxPlayers", e.target.value)}
              className={inputStyle}
              placeholder="16"
            />
          </Field>

          <Field label="Price">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">AED</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleChange("price", e.target.value)}
                className={`${inputStyle} pl-14`}
                placeholder="0.00"
              />
            </div>
          </Field>

          <Field label="Match Location">
            <div className="relative">
              {isLoaded && (
                <Autocomplete
                  onLoad={(auto) => setAutocomplete(auto)}
                  onPlaceChanged={onPlaceChanged}
                >
                  <input
                    value={formData.location.address}
                    onChange={(e) =>
                      handleChange("location", {
                        ...formData.location,
                        address: e.target.value,
                      })
                    }
                    className={inputStyle}
                    placeholder="Search or pin location"
                  />
                </Autocomplete>
              )}

              <button
                type="button"
                onClick={() => setShowMap((prev) => !prev)}
                className="mt-2 text-sm text-blue-600 hover:underline"
              >
                📍 Pick from map
              </button>

              {showMap && isLoaded && (
                <div className="bg-white border rounded-lg shadow-lg p-2 mt-2">
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

            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-full px-4 py-2 bg-black text-white hover:bg-black/90 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? <ClipLoader size={18} color="white" /> : "Save"}
            </button>
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

export default EditMatchModal;
