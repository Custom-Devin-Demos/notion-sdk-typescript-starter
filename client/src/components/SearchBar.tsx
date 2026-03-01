import { useState, useEffect, useRef } from "react";
import { useSearch, NotionPage } from "../hooks/useNotion";
import { getPageTitle } from "../utils/notion";

interface SearchBarProps {
  onSelectPage: (pageId: string) => void;
}

export default function SearchBar({ onSelectPage }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { results, loading, search } = useSearch();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) return;

    debounceRef.current = setTimeout(() => {
      search(query);
      setIsOpen(true);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, search]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(page: NotionPage) {
    onSelectPage(page.id);
    setQuery("");
    setIsOpen(false);
  }

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search pages..."
        className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-md border border-gray-600 focus:outline-none focus:border-blue-500 text-sm placeholder-gray-400"
      />
      {loading && (
        <div className="absolute right-3 top-2.5 text-gray-400 text-xs">
          Searching...
        </div>
      )}
      {isOpen && results.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {results.map((page) => (
            <button
              key={page.id}
              onClick={() => handleSelect(page)}
              className="w-full text-left px-3 py-2 text-sm text-gray-200 hover:bg-gray-700 border-b border-gray-700 last:border-b-0"
            >
              {page.icon?.emoji && (
                <span className="mr-2">{page.icon.emoji}</span>
              )}
              {getPageTitle(page)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
