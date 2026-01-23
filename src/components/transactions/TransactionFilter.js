"use client";
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const TransactionFilter = ({
  onFilterChange,
  value: externalValue,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filters = [
    { value: "all", label: "All " },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
    { value: "failed", label: "Failed" },
  ];

  const handleFilterSelect = (filterValue) => {
    setSelectedFilter(filterValue);
    setIsOpen(false);
    onFilterChange?.(filterValue);
  };

  const currentFilter =
    externalValue !== undefined ? externalValue : selectedFilter;
  const currentLabel =
    filters.find((f) => f.value === currentFilter)?.label || "All Transactions";

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2 px-3 py-2 text-sm font-medium transition-all duration-200 bg-white border border-gray-300 shadow-sm rounded-3xl min-w-32 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <span>{currentLabel}</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 w-48 mt-1 overflow-auto bg-white border border-gray-200 shadow-lg rounded-3xl max-h-60">
          {filters.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => handleFilterSelect(value)}
              className="w-full text-left px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition-colors duration-150 first:rounded-t-md last:rounded-b-md"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionFilter;
