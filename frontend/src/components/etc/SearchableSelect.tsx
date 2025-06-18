import { useState, useRef, useEffect } from 'react';

export interface ISelectOption {
  value: string|number;
  label: string;
}

interface SearchableSelectProps {
  name?:string;
  options: ISelectOption[]|[];
  value?: string|number|null;
  onChange: (value: string|number) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const SearchableSelect = ({
  name,
  options,
  value,
  onChange,
  placeholder = 'جستجو یا انتخاب کنید...',
  className = '',
  disabled = false
}: SearchableSelectProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div
        className={`text-gray-800 font-bold flex items-center justify-between p-2 border border-gray-300 rounded-md cursor-pointer bg-white`}
        onClick={() =>!disabled && setIsOpen(!isOpen)}
      >
        <span className={!value ? (disabled?"text-gray-50":'text-gray-800') : ''}>
          {selectedOption?.label || placeholder}
        </span>
        <svg
          className={`w-5 h-5 text-gray-800 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <div className="p-2 border-b">
            <input
              type="text"
              name={name}
              placeholder="جستجو..."
              className="w-full p-1 text-sm border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(option => (
                <div
                  key={option.value}
                  className={`text-gray-950 font-bold text-center p-2 cursor-pointer rounded-2xl hover:bg-gray-100 ${
                    value === option.value ? 'bg-blue-50 text-blue-600' : ''
                  }`}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="p-2 text-sm text-gray-800">نتیجه‌ای یافت نشد</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};