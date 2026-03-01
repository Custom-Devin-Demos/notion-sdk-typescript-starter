import { usePages, NotionPage } from "../hooks/useNotion";
import { getPageTitle } from "../utils/notion";
import SearchBar from "./SearchBar";

interface SidebarProps {
  selectedPageId: string | null;
  onSelectPage: (pageId: string) => void;
}

export default function Sidebar({ selectedPageId, onSelectPage }: SidebarProps) {
  const { pages, loading, error } = usePages();

  return (
    <aside className="w-64 bg-gray-900 text-gray-100 h-screen flex flex-col border-r border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-lg font-semibold mb-3">Notion Dashboard</h1>
        <SearchBar onSelectPage={onSelectPage} />
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        {loading && (
          <div className="px-4 py-8 text-center text-gray-400 text-sm">
            Loading pages...
          </div>
        )}

        {error && (
          <div className="px-4 py-3 text-red-400 text-sm">
            Error: {error}
          </div>
        )}

        {!loading &&
          !error &&
          pages.map((page: NotionPage) => (
            <button
              key={page.id}
              onClick={() => onSelectPage(page.id)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-800 transition-colors ${
                selectedPageId === page.id
                  ? "bg-gray-800 text-white"
                  : "text-gray-300"
              }`}
            >
              {page.icon?.emoji && (
                <span className="mr-2">{page.icon.emoji}</span>
              )}
              {getPageTitle(page)}
            </button>
          ))}

        {!loading && !error && pages.length === 0 && (
          <div className="px-4 py-8 text-center text-gray-500 text-sm">
            No pages found
          </div>
        )}
      </nav>
    </aside>
  );
}
