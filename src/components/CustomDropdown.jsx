import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export function CustomDropdown({
  value = '',
  onChange,
  options = [],
  placeholder = 'Select...',
  required = false,
  disabled = false,
  className = '',
  allowCustom = true,
  name,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const [isTyping, setIsTyping] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Sync internal input value with external value
  useEffect(() => {
    setInputValue(value || '');
    setIsTyping(false);
  }, [value]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setIsTyping(false);
        if (allowCustom && inputValue.trim() && inputValue.trim() !== (value || '')) {
          if (onChange) onChange(inputValue.trim());
        } else {
          setInputValue(value || '');
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, inputValue, value, onChange, allowCustom]);

  // Normalize options array
  const normalizedOptions = options.map((opt) =>
    typeof opt === 'string' ? { label: opt, value: opt } : opt
  );

  // If user is actively typing a different query, filter options; otherwise show ALL data
  const filteredOptions =
    isTyping && inputValue.trim() && inputValue.trim().toLowerCase() !== (value || '').toLowerCase()
      ? normalizedOptions.filter((opt) =>
          opt.label.toLowerCase().includes(inputValue.toLowerCase().trim())
        )
      : normalizedOptions;

  const handleSelect = (val) => {
    setInputValue(val);
    setIsTyping(false);
    if (onChange) onChange(val);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Trigger Box */}
      <div
        onClick={() => {
          if (disabled) return;
          const next = !isOpen;
          setIsOpen(next);
          setIsTyping(false);
          if (next && inputRef.current) {
            inputRef.current.focus();
          }
        }}
        className={`w-full h-11 px-3.5 rounded-lg border bg-[#FFF0F5] text-[#1A0510] text-sm font-medium transition-all cursor-pointer flex items-center justify-between gap-2 select-none ${
          isOpen
            ? 'border-[#C2185B] bg-[#FCE4EC]'
            : 'border-[#F8C4D8] hover:border-[#C2185B] hover:bg-[#FCE4EC]'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input
          ref={inputRef}
          type="text"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-autocomplete="none"
          data-form-type="other"
          data-lpignore="true"
          required={required && !value}
          value={inputValue}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => {
            const newVal = e.target.value;
            setInputValue(newVal);
            setIsTyping(true);
            if (!isOpen) setIsOpen(true);
            if (allowCustom && onChange) {
              onChange(newVal);
            }
          }}
          onFocus={() => {
            setIsOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (filteredOptions.length > 0) {
                handleSelect(filteredOptions[0].value);
              } else if (allowCustom && inputValue.trim()) {
                handleSelect(inputValue.trim());
              }
            } else if (e.key === 'Escape') {
              setIsOpen(false);
              setIsTyping(false);
              setInputValue(value || '');
            }
          }}
          style={{ backgroundColor: 'transparent' }}
          className="w-full bg-transparent custom-dropdown-input outline-none border-none p-0 text-sm text-[#1A0510] font-medium placeholder-[#7B4A5E] cursor-pointer"
        />

        <div className="flex items-center shrink-0">
          <ChevronDown
            className={`w-4 h-4 text-[#C2185B] stroke-[2.2] transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </div>

      {/* Floating Options Menu matching the sidebar */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-lg border border-[#C2185B] bg-[#FFF0F5] overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="max-h-56 overflow-y-auto py-1 divide-y divide-[#F8C4D8]/40">
            {filteredOptions.length === 0 ? (
              <div className="px-3.5 py-3 text-xs text-[#7B4A5E] italic">
                {allowCustom && inputValue.trim() ? (
                  <span>
                    No exact match. Press Enter to use "<strong>{inputValue.trim()}</strong>"
                  </span>
                ) : (
                  'No options found'
                )}
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = (value || '').toLowerCase() === opt.value.toLowerCase();
                return (
                  <div
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className={`px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center justify-between cursor-pointer transition-colors duration-150 ${
                      isSelected
                        ? 'bg-white text-[#C2185B] border-l-4 border-l-[#C2185B]'
                        : 'text-[#4A1C30] hover:bg-[#FCE4EC] hover:text-[#C2185B] border-l-4 border-l-transparent'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-[#C2185B] stroke-[3] shrink-0" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomDropdown;
