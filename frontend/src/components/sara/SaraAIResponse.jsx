const normalizeLine = (line) =>
  line
    .replace(/â€¢/g, "-")
    .replace(/^\s*[•*]\s+/, "- ")
    .trimEnd();

const renderInline = (text = "") => {
  const parts = [];
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith("**")) {
      parts.push(
        <strong key={`${match.index}-bold`} className="font-semibold text-slate-900">
          {token.slice(2, -2)}
        </strong>
      );
    } else {
      parts.push(
        <code
          key={`${match.index}-code`}
          className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[13px] text-slate-800"
        >
          {token.slice(1, -1)}
        </code>
      );
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length ? parts : text;
};

const parseMarkdown = (text = "") => {
  const lines = text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map(normalizeLine);

  const blocks = [];
  let list = null;
  let paragraph = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ type: "p", text: paragraph.join(" ") });
      paragraph = [];
    }
  };

  const flushList = () => {
    if (list?.items.length) blocks.push(list);
    list = null;
  };

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed || /^-{3,}$/.test(trimmed) || /^\*{3,}$/.test(trimmed)) {
      flushParagraph();
      flushList();
      return;
    }

    const heading = trimmed.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      blocks.push({
        type: `h${Math.min(heading[1].length, 4)}`,
        text: heading[2],
      });
      return;
    }

    const bullet = trimmed.match(/^[-*+]\s+(.+)$/);
    if (bullet) {
      flushParagraph();
      if (!list || list.type !== "ul") list = { type: "ul", items: [] };
      list.items.push(bullet[1]);
      return;
    }

    const numbered = trimmed.match(/^\d+[.)]\s+(.+)$/);
    if (numbered) {
      flushParagraph();
      if (!list || list.type !== "ol") list = { type: "ol", items: [] };
      list.items.push(numbered[1]);
      return;
    }

    flushList();
    paragraph.push(trimmed.replace(/^#+\s*/, ""));
  });

  flushParagraph();
  flushList();
  return blocks;
};

export default function SaraAIResponse({ response = "" }) {
  const blocks = parseMarkdown(response);

  if (!blocks.length) {
    return null;
  }

  return (
    <div className="rounded-[26px] border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <div className="space-y-4 text-[15px] leading-7 text-slate-700">
        {blocks.map((block, index) => {
          if (block.type === "h1") {
            return (
              <h2 key={index} className="text-2xl font-black tracking-tight text-slate-950">
                {renderInline(block.text)}
              </h2>
            );
          }

          if (block.type === "h2") {
            return (
              <h3 key={index} className="text-xl font-black text-slate-900">
                {renderInline(block.text)}
              </h3>
            );
          }

          if (block.type === "h3") {
            return (
              <h4 key={index} className="text-lg font-bold text-slate-900">
                {renderInline(block.text)}
              </h4>
            );
          }

          if (block.type === "h4") {
            return (
              <h5 key={index} className="text-base font-semibold text-slate-800">
                {renderInline(block.text)}
              </h5>
            );
          }

          if (block.type === "ul") {
            return (
              <ul key={index} className="space-y-2 pl-1">
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex gap-3">
                    <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                    <span>{renderInline(item)}</span>
                  </li>
                ))}
              </ul>
            );
          }

          if (block.type === "ol") {
            return (
              <ol key={index} className="space-y-2">
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-50 text-xs font-bold text-orange-600">
                      {itemIndex + 1}
                    </span>
                    <span>{renderInline(item)}</span>
                  </li>
                ))}
              </ol>
            );
          }

          return (
            <p key={index} className="text-slate-700">
              {renderInline(block.text)}
            </p>
          );
        })}
      </div>
    </div>
  );
}
