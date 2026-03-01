import { NotionBlock } from "../hooks/useNotion";

interface RichText {
  plain_text: string;
  annotations?: {
    bold?: boolean;
    italic?: boolean;
    strikethrough?: boolean;
    underline?: boolean;
    code?: boolean;
    color?: string;
  };
  href?: string | null;
}

interface BlockData {
  rich_text?: RichText[];
  caption?: RichText[];
  language?: string;
  url?: string;
  checked?: boolean;
  color?: string;
}

function renderRichText(richTexts: RichText[]): JSX.Element[] {
  return richTexts.map((text, i) => {
    let content: JSX.Element | string = text.plain_text;
    const ann = text.annotations;

    if (ann?.code) {
      content = (
        <code className="bg-gray-700 px-1.5 py-0.5 rounded text-sm text-pink-300">
          {content}
        </code>
      );
    }
    if (ann?.bold) {
      content = <strong>{content}</strong>;
    }
    if (ann?.italic) {
      content = <em>{content}</em>;
    }
    if (ann?.strikethrough) {
      content = <s>{content}</s>;
    }
    if (ann?.underline) {
      content = <u>{content}</u>;
    }
    if (text.href) {
      content = (
        <a
          href={text.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          {content}
        </a>
      );
    }

    return <span key={i}>{content}</span>;
  });
}

function getBlockData(block: NotionBlock): BlockData {
  const blockType = block.type;
  return (block[blockType] as BlockData) || {};
}

function renderBlock(block: NotionBlock): JSX.Element | null {
  const data = getBlockData(block);
  const richText = data.rich_text || [];

  switch (block.type) {
    case "paragraph":
      return (
        <p className="text-gray-200 leading-relaxed mb-3">
          {renderRichText(richText)}
        </p>
      );

    case "heading_1":
      return (
        <h1 className="text-2xl font-bold text-white mt-6 mb-3">
          {renderRichText(richText)}
        </h1>
      );

    case "heading_2":
      return (
        <h2 className="text-xl font-semibold text-white mt-5 mb-2">
          {renderRichText(richText)}
        </h2>
      );

    case "heading_3":
      return (
        <h3 className="text-lg font-medium text-white mt-4 mb-2">
          {renderRichText(richText)}
        </h3>
      );

    case "bulleted_list_item":
      return (
        <li className="text-gray-200 ml-4 list-disc mb-1">
          {renderRichText(richText)}
        </li>
      );

    case "numbered_list_item":
      return (
        <li className="text-gray-200 ml-4 list-decimal mb-1">
          {renderRichText(richText)}
        </li>
      );

    case "to_do":
      return (
        <div className="flex items-start gap-2 mb-1 text-gray-200">
          <input
            type="checkbox"
            checked={data.checked || false}
            readOnly
            className="mt-1"
          />
          <span className={data.checked ? "line-through text-gray-500" : ""}>
            {renderRichText(richText)}
          </span>
        </div>
      );

    case "toggle":
      return (
        <details className="mb-2 text-gray-200">
          <summary className="cursor-pointer hover:text-white">
            {renderRichText(richText)}
          </summary>
        </details>
      );

    case "code":
      return (
        <pre className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-3 overflow-x-auto">
          <code className="text-sm text-green-300">
            {richText.map((t) => t.plain_text).join("")}
          </code>
        </pre>
      );

    case "quote":
      return (
        <blockquote className="border-l-4 border-gray-500 pl-4 italic text-gray-300 mb-3">
          {renderRichText(richText)}
        </blockquote>
      );

    case "callout":
      return (
        <div className="flex gap-3 bg-gray-800 border border-gray-700 rounded-lg p-4 mb-3">
          <span className="text-xl">{data.color === "gray_background" ? "💡" : "📌"}</span>
          <div className="text-gray-200">{renderRichText(richText)}</div>
        </div>
      );

    case "divider":
      return <hr className="border-gray-700 my-4" />;

    case "image": {
      const imageUrl = data.url || "";
      const caption = data.caption || [];
      return (
        <figure className="mb-4">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={caption.map((c) => c.plain_text).join("") || "Image"}
              className="max-w-full rounded-lg"
            />
          )}
          {caption.length > 0 && (
            <figcaption className="text-sm text-gray-400 mt-2 text-center">
              {renderRichText(caption)}
            </figcaption>
          )}
        </figure>
      );
    }

    case "bookmark": {
      const url = data.url || "";
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-gray-800 border border-gray-700 rounded-lg p-3 mb-3 text-blue-400 hover:bg-gray-750 text-sm truncate"
        >
          🔗 {url}
        </a>
      );
    }

    default:
      if (richText.length > 0) {
        return (
          <div className="text-gray-300 mb-2">{renderRichText(richText)}</div>
        );
      }
      return null;
  }
}

interface ContentRendererProps {
  blocks: NotionBlock[];
}

export default function ContentRenderer({ blocks }: ContentRendererProps) {
  return (
    <div className="max-w-3xl">
      {blocks.map((block) => (
        <div key={block.id}>{renderBlock(block)}</div>
      ))}
    </div>
  );
}
