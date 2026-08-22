import sanitizeHtml from "sanitize-html";

export function sanitizeContent(htmlContent: string): string {
  if (!htmlContent) return "";
  return sanitizeHtml(htmlContent, {
    allowedTags: [
      "h1", "h2", "h3", "h4", "h5", "h6",
      "p", "span", "strong", "em", "b", "i", "u", "s", "strike",
      "a", "ul", "ol", "li", "blockquote", "code", "pre", "hr",
      "table", "thead", "tbody", "tr", "th", "td",
      "img", "figure", "figcaption", "details", "summary",
      "div", "kbd", "mark", "sub", "sup"
    ],
    allowedAttributes: {
      a: ["href", "name", "target", "rel", "class"],
      img: ["src", "alt", "title", "width", "height", "class", "loading"],
      code: ["class"],
      pre: ["class"],
      span: ["class"],
      div: ["class", "data-*"],
      td: ["colspan", "rowspan", "align"],
      th: ["colspan", "rowspan", "align"],
      "*": ["id", "class", "data-title"]
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: (tagName, attribs) => {
        return {
          tagName: "a",
          attribs: {
            ...attribs,
            rel: "noopener noreferrer",
            target: attribs.target || "_blank",
          },
        };
      },
      img: (tagName, attribs) => {
        return {
          tagName: "img",
          attribs: {
            ...attribs,
            loading: "lazy",
          },
        };
      },
    },
  });
}

// Plain text stripper for excerpts & reading time calculations
export function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "").trim();
}

// Reading time calculator
export function calculateReadingTime(content: string): string {
  const plainText = stripHtml(content);
  const words = plainText.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}
