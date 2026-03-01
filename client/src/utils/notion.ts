import { NotionPage } from "../hooks/useNotion";

interface TitleProperty {
  type: "title";
  title: Array<{ plain_text: string }>;
}

function isTitleProperty(val: unknown): val is TitleProperty {
  if (typeof val !== "object" || val === null) return false;
  const obj = val as Record<string, unknown>;
  return obj.type === "title" && Array.isArray(obj.title);
}

export function getPageTitle(page: NotionPage): string {
  const props = page.properties;
  for (const key of Object.keys(props)) {
    const prop = props[key];
    if (isTitleProperty(prop)) {
      return (
        prop.title.map((t) => t.plain_text).join("") || "Untitled"
      );
    }
  }
  return "Untitled";
}
