import React, { useState, useRef, useEffect } from 'react';
import { Check } from 'lucide-react';

export function SuggestionInput({
  name,
  value = '',
  onChange,
  placeholder = '',
  suggestions = [],
  className = '',
  required = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter suggestions based on what the user types (or show all if empty/matching)
  const filtered = suggestions.filter((s) => {
    if (!value || !value.trim()) return true;
    return s.toLowerCase().includes(value.toLowerCase().trim());
  });

  const handleSelect = (val) => {
    if (onChange) {
      onChange({ target: { name, value: val } });
    }
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0 && highlightedIndex < filtered.length) {
        e.preventDefault();
        handleSelect(filtered[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        name={name}
        value={value}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        data-form-type="other"
        data-lpignore="true"
        required={required}
        placeholder={placeholder}
        onFocus={() => setIsOpen(true)}
        onChange={(e) => {
          if (onChange) onChange(e);
          setIsOpen(true);
          setHighlightedIndex(-1);
        }}
        onKeyDown={handleKeyDown}
        className={
          className ||
          'w-full h-11 px-3.5 rounded-lg border border-[#F8C4D8] bg-card text-sm text-[#1A0510] outline-none focus:outline-none focus:border-[#C2185B] transition-colors'
        }
      />

      {/* Suggestion Popover Menu matching site/brand design */}
      {isOpen && filtered.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-lg border border-[#F8C4D8] bg-white shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
          {/* Triangular pointer beak at the top matching user's design */}
          <div className="absolute -top-1.5 left-6 w-3 h-3 bg-white border-t border-l border-[#F8C4D8] rotate-45 z-10" />

          {/* Suggestions List */}
          <div className="max-h-56 overflow-y-auto py-1 divide-y divide-[#F8C4D8]/30">
            {filtered.map((item, idx) => {
              const isSelected = (value || '').trim().toLowerCase() === item.toLowerCase();
              const isHighlighted = idx === highlightedIndex;

              return (
                <div
                  key={item}
                  onMouseDown={(e) => {
                    // Prevent blur from closing before click registers
                    e.preventDefault();
                    handleSelect(item);
                  }}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  className={`px-3.5 py-2.5 text-xs sm:text-sm font-medium flex items-center justify-between cursor-pointer transition-colors duration-150 ${
                    isSelected
                      ? 'bg-[#FFF5F8] text-[#C2185B] font-semibold border-l-3 border-[#C2185B]'
                      : isHighlighted
                        ? 'bg-[#FFF5F8] text-[#C2185B]'
                        : 'text-[#1A0510] hover:bg-[#FFF5F8] hover:text-[#C2185B]'
                  }`}
                >
                  <span>{item}</span>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-[#C2185B] stroke-[3] shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default SuggestionInput;

