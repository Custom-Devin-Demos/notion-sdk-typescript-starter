import { useState } from "react";
import Sidebar from "./components/Sidebar";
import ContentRenderer from "./components/ContentRenderer";
import { usePageBlocks } from "./hooks/useNotion";

export default function App() {
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const { blocks, loading, error } = usePageBlocks(selectedPageId);

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100">
      <Sidebar
        selectedPageId={selectedPageId}
        onSelectPage={setSelectedPageId}
      />

      <main className="flex-1 overflow-y-auto">
        {!selectedPageId && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <div className="text-5xl mb-4">📖</div>
              <h2 className="text-xl font-medium mb-2">
                Select a page to view
              </h2>
              <p className="text-sm">
                Choose a page from the sidebar or use search
              </p>
            </div>
          </div>
        )}

        {selectedPageId && loading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-400">Loading page content...</div>
          </div>
        )}

        {selectedPageId && error && (
          <div className="p-8">
            <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-300">
              Error loading page: {error}
            </div>
          </div>
        )}

        {selectedPageId && !loading && !error && (
          <div className="p-8">
            <ContentRenderer blocks={blocks} />
          </div>
        )}
      </main>
    </div>
  );
}
