import { useState, useEffect, useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export interface NotionPage {
  id: string;
  object: string;
  properties: Record<string, unknown>;
  icon?: { type: string; emoji?: string } | null;
  created_time: string;
  last_edited_time: string;
}

export interface NotionBlock {
  id: string;
  type: string;
  has_children: boolean;
  [key: string]: unknown;
}

interface PagesResponse {
  pages: NotionPage[];
  has_more: boolean;
  next_cursor: string | null;
}

interface BlocksResponse {
  blocks: NotionBlock[];
  has_more: boolean;
  next_cursor: string | null;
}

interface SearchResponse {
  results: NotionPage[];
  has_more: boolean;
  next_cursor: string | null;
}

export function usePages() {
  const [pages, setPages] = useState<NotionPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPages() {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/pages`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: PagesResponse = await res.json();
        setPages(data.pages);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch pages");
      } finally {
        setLoading(false);
      }
    }
    fetchPages();
  }, []);

  return { pages, loading, error };
}

export function usePageBlocks(pageId: string | null) {
  const [blocks, setBlocks] = useState<NotionBlock[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pageId) {
      setBlocks([]);
      return;
    }

    let cancelled = false;

    async function fetchBlocks() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_URL}/api/pages/${pageId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: BlocksResponse = await res.json();
        if (!cancelled) setBlocks(data.blocks);
      } catch (err) {
        if (!cancelled)
          setError(
            err instanceof Error ? err.message : "Failed to fetch page blocks"
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchBlocks();

    return () => {
      cancelled = true;
    };
  }, [pageId]);

  return { blocks, loading, error };
}

export function useSearch() {
  const [results, setResults] = useState<NotionPage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await fetch(
        `${API_URL}/api/search?q=${encodeURIComponent(query)}`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: SearchResponse = await res.json();
      setResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search");
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, error, search };
}
