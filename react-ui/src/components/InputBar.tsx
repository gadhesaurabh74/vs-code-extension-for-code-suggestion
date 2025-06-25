// src/components/InputBar.tsx
import React, { useEffect, useState } from 'react';

interface Props {
  onSend: (input: string) => void;
  fileSuggestions: string[];
}

const InputBar: React.FC<Props> = ({ onSend, fileSuggestions }) => {
  const [input, setInput] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const atIndex = input.lastIndexOf('@');
    if (atIndex !== -1) {
      const query = input.slice(atIndex + 1).toLowerCase();
      const matches = fileSuggestions.filter((f) => f.toLowerCase().includes(query));
      setFilteredSuggestions(matches.slice(0, 5)); // Limit suggestions
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [input, fileSuggestions]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setInput('');
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (file: string) => {
    const atIndex = input.lastIndexOf('@');
    const before = input.slice(0, atIndex);
    const afterInsert = `${before}@${file} `;
    setInput(afterInsert);
    setShowSuggestions(false);
  };

  return (
    <div className="relative flex items-center gap-2 text-xl">
      <textarea
        className="flex-1 bg-white border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none"
        rows={1}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message... use @ to reference a file"
      />
      <button
        onClick={handleSend}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Send
      </button>

      {/* Autocomplete Dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul className="absolute bottom-full mb-1 left-0 w-full bg-white border border-gray-300 rounded shadow z-10 max-h-48 overflow-y-auto">
          {filteredSuggestions.map((file, i) => (
            <li
              key={i}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => handleSuggestionClick(file)}
            >
              {file}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InputBar;
