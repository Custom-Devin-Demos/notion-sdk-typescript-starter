import { Client } from "@notionhq/client";
import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";

const notion = new Client({
  auth: env.NOTION_TOKEN,
});

export interface NotionRequest extends Request {
  notion?: Client;
}

export function attachNotion(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  (req as NotionRequest).notion = notion;
  next();
}
