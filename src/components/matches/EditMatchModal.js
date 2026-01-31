import { useState, useEffect, useCallback } from "react";
import Button from "../Button";
import { ClipLoader } from "react-spinners";
import { Cross, CrossIcon } from "lucide-react";

const EditMatchModal = ({
  isOpen,
  onClose,
  onSave,
  subCommunitiesData,
  initialData = {},
  isLoading = false,
}) => {
  const [subCommunities, setSubcommunities] = useState([]);
  const [formData, setFormData] = useState({
    matchName: "",
    subCommunity: {},
    duration: "",
    matchType: "",
    matchMode: "",
    skillRange: [],
    date: "",
    startTime: "",
    time: "",
    maxPlayers: "",
  });
  const SKILLS = ["A", "B+", "B", "B-", "C-", "C", "C strong", "C+", "D", "D+"];
  const toggleSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skillRange: prev.skillRange.includes(skill)
        ? prev.skillRange.filter((s) => s !== skill)
        : [...prev.skillRange, skill],
    }));
  };

  useEffect(() => {
    console.log(initialData);
    setSubcommunities(subCommunitiesData);
    if (isOpen && initialData) {
      setFormData({
        matchName: initialData.name || "",
        subCommunity: initialData.community || {},
        duration: initialData.duration || "",
        matchType: initialData.currentVerificationStatus || "",
        matchMode: initialData.matchMode || "",
        skillRange: initialData.skills || [],
        date: initialData.date || "",
        time: initialData.time || "",
        startTime: initialData.startTime || "",
        endTime: initialData.endTime || "",
        maxPlayers: initialData.playersRequired || "",
      });
    }
  }, [isOpen, initialData, subCommunitiesData]);

  const handleChange = useCallback((key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

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

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          <Field label="Match Name">
            <input
              value={formData.matchName}
              onChange={(e) => handleChange("matchName", e.target.value)}
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
              {subCommunities.map((item) => (
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

          <div className="grid grid-cols-2 gap-3">
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

            <Field label="Time">
              <input
                type="time"
                value={formData.startTime.slice(11, 16)}
                onChange={(e) => {
                  handleChange("time", e.target.value);
                }}
                className={inputStyle}
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
              {isLoading ? <ClipLoader size={18} color="white" /> : "Save"}
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

export default EditMatchModal;
