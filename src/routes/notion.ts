import { Router, Response } from "express";
import { NotionRequest } from "../middleware/auth";

const router = Router();

// GET /api/pages - List all pages in the workspace
router.get("/pages", async (req, res: Response) => {
  try {
    const notionReq = req as NotionRequest;
    const cursor = req.query.cursor as string | undefined;

    const response = await notionReq.notion!.search({
      filter: {
        property: "object",
        value: "page",
      },
      page_size: 20,
      start_cursor: cursor || undefined,
    });

    res.json({
      pages: response.results,
      has_more: response.has_more,
      next_cursor: response.next_cursor,
    });
  } catch (error) {
    console.error("Error fetching pages:", error);
    res.status(500).json({ error: "Failed to fetch pages" });
  }
});

// GET /api/pages/:id - Get blocks for a specific page
router.get("/pages/:id", async (req, res: Response) => {
  try {
    const notionReq = req as NotionRequest;
    const { id } = req.params;
    const cursor = req.query.cursor as string | undefined;

    const response = await notionReq.notion!.blocks.children.list({
      block_id: id,
      page_size: 100,
      start_cursor: cursor || undefined,
    });

    res.json({
      blocks: response.results,
      has_more: response.has_more,
      next_cursor: response.next_cursor,
    });
  } catch (error) {
    console.error("Error fetching page blocks:", error);
    res.status(500).json({ error: "Failed to fetch page blocks" });
  }
});

// GET /api/search?q=term - Search the workspace
router.get("/search", async (req, res: Response) => {
  try {
    const notionReq = req as NotionRequest;
    const query = req.query.q as string;
    const cursor = req.query.cursor as string | undefined;

    if (!query) {
      res.status(400).json({ error: "Query parameter 'q' is required" });
      return;
    }

    const response = await notionReq.notion!.search({
      query,
      filter: {
        property: "object",
        value: "page",
      },
      page_size: 20,
      start_cursor: cursor || undefined,
    });

    res.json({
      results: response.results,
      has_more: response.has_more,
      next_cursor: response.next_cursor,
    });
  } catch (error) {
    console.error("Error searching:", error);
    res.status(500).json({ error: "Failed to search" });
  }
});

export default router;
