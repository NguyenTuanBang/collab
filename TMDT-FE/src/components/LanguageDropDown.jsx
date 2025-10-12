import { useState, useRef, useEffect } from "react";
import { GlobeAltIcon } from "@heroicons/react/24/outline";

const LanguageDropDown = ({ options, defaultValue = "vi", onChange }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue);
  const dropdownRef = useRef(null);

  const selectedOption = options.find((opt) => opt.key === selected);

  const handleSelect = (key) => {
    setSelected(key);
    setOpen(false);
    if (onChange) onChange(key);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="w-32 flex items-center justify-between px-3 py-2 rounded-lg text-white font-medium hover:bg-white/20 transition cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <GlobeAltIcon className="w-5 h-5" />
          {selectedOption?.icon && <span>{selectedOption.icon}</span>}
          <span>{selectedOption?.label}</span>
        </div>
      </button>
      <div
        className={`absolute left-0 mt-1 w-40 
              bg-gradient-to-r from-blue-500 to-indigo-600 text-white 
              rounded-lg shadow-lg border border-white/30 z-50 
              transform origin-top-right transition-all duration-200
              ${
                open
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
      >
        {options.map((opt) => (
          <button
            key={opt.key}
            onClick={() => handleSelect(opt.key)}
            className="cursor-pointer flex items-center w-full px-4 py-2 text-left rounded-md hover:bg-white/20 transition"
          >
            {opt.icon && <span className="mr-2">{opt.icon}</span>}
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageDropDown;
