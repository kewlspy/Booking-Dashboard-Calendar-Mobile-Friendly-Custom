import React from "react";
import { useState, useEffect, useRef } from "react";

export default function Autocomplete({
  fetchSuggestions,
  onSelect,
  getSuggestionLabel,
  placeholder,
}) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (!input) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timeout = setTimeout(() => {
      fetchSuggestions(input).then((results) => {
        setSuggestions(results);
        setShowSuggestions(true);
        setHighlightedIndex(-1);
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, [input]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item) => {
    setInput(getSuggestionLabel(item));
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    onSelect(item);
  };

  const handleKey = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        handleSelect(suggestions[highlightedIndex]);
      }
    }
  };

  useEffect(() => {
    if (listRef.current && highlightedIndex >= 0) {
      const listItem = listRef.current.children[highlightedIndex];
      if (listItem) listItem.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex]);

  return (
    <div className="relative w-full" ref={containerRef}>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKey}
        placeholder={placeholder}
        className="w-full p-2 border border-teal-300 rounded active:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
      />
      {showSuggestions && (
        <ul
          role="listbox"
          className="absolute z-10 bg-white border border-teal-200 mt-1 w-full max-h-60 overflow-auto rounded"
          ref={listRef}
        >
          {suggestions.length === 0 && (
            <li role="option" className="p-2 text-gray-400">
              No results
            </li>
          )}
          {suggestions.map((item, idx) => (
            <li
              role="option"
              aria-selected={idx === highlightedIndex}
              key={idx}
              onClick={() => handleSelect(item)}
              className={`p-2 cursor-pointer ${
                idx === highlightedIndex
                  ? "bg-teal-100 text-teal-800"
                  : "hover:bg-gray-100"
              }`}
            >
              {getSuggestionLabel(item)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
