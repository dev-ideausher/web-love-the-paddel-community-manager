"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

export default function NotificationDynamicDropdown({
  data = [],
  placeholder,
  callback,
  value,
  loading
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const ref = useRef(null);

useEffect(() => {
  if (value) {
    const newSelected = Array.isArray(value) ? value : [value];
    setSelectedValues(newSelected);
    setSelectAll(newSelected.length === data.length && data.length > 0);
  } else {
    setSelectedValues([]);
    setSelectAll(false);
  }
}, [value, data]);


  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedValues([]);
      callback([]);
      setSelectAll(false);
    } else {
      const allItems = data;
      setSelectedValues(allItems);
      callback(allItems);
      setSelectAll(true);
    }
  };

  const handleSelect = (item) => {
    let updated;
    if (selectedValues.some((val) => val.id === item.id)) {
      updated = selectedValues.filter((val) => val.id !== item.id);
    } else {
      updated = [...selectedValues, item];
    }
    setSelectedValues(updated);
    callback(updated);
    setSelectAll(updated.length === data.length);
  };

  return (
    <div className="w-full relative">
      <div
        onClick={toggleDropdown}
        className="cursor-pointer w-full flex items-center justify-between py-3 pl-5 rounded-lg bg-grey-6"
      >
        <span
          className={`capitalize ${
            selectedValues.length > 0 ? "text-black" : "text-[#6E6E6E]"
          } text-sm font-normal`}
        >
          {selectedValues.length > 0
            ? `${selectedValues.length} selected`
            : placeholder}
        </span>
        <span className="absolute top-3 right-2">
          {isOpen ? <ChevronUp color="#686868" /> : <ChevronDown color="#686868" />}
        </span>
      </div>

      {isOpen && (
        <ul className="absolute left-0 w-full mt-1 border border-[#D0D0D0] bg-white rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
          <li
            className="cursor-pointer py-2 px-4 hover:bg-gray-100 text-sm font-semibold text-primary flex items-center gap-2"
            onClick={handleSelectAll}
          >
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
              className="text-primary"
            />
            Select All
          </li>

          {data.map((item, index) => (
            <li
              key={`${placeholder}-${index}`}
              onClick={() => handleSelect(item)}
              className="cursor-pointer py-2 px-4 hover:bg-gray-100 text-sm text-black flex items-center gap-2"
            >
              <input
                type="checkbox"
                checked={selectedValues.some((val) => val.id === item.id)}
                onChange={() => handleSelect(item)}
                className="accent-primary"
              />
              {item.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
