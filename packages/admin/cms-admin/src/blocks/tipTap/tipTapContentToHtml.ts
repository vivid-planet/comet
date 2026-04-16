import { type JSONContent } from "@tiptap/react";

function escapeHtml(text: string): string {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function serializeMarks(text: string, marks?: JSONContent["marks"]): string {
    let html = escapeHtml(text);
    if (!marks || marks.length === 0) {
        return html;
    }

    for (const mark of marks) {
        switch (mark.type) {
            case "bold":
                html = `<strong>${html}</strong>`;
                break;
            case "italic":
                html = `<em>${html}</em>`;
                break;
            case "strike":
                html = `<del>${html}</del>`;
                break;
            case "superscript":
                html = `<sup>${html}</sup>`;
                break;
            case "subscript":
                html = `<sub>${html}</sub>`;
                break;
            case "link":
                if (mark.attrs?.data) {
                    const encodedData = encodeURIComponent(JSON.stringify(mark.attrs.data));
                    html = `<a href="comet-link://${encodedData}">${html}</a>`;
                }
                break;
        }
    }

    return html;
}

function serializeInlineContent(nodes: JSONContent[] | undefined): string {
    if (!nodes) {
        return "";
    }

    return nodes
        .map((node) => {
            switch (node.type) {
                case "text":
                    return serializeMarks(node.text ?? "", node.marks);
                case "hardBreak":
                    return "<br>";
                case "nonBreakingSpace":
                    return "\u00a0";
                case "softHyphen":
                    return "\u00ad";
                default:
                    return "";
            }
        })
        .join("");
}

function blockStyleClassAttr(attrs: JSONContent["attrs"]): string {
    const blockStyle = attrs?.blockStyle;
    if (blockStyle && typeof blockStyle === "string") {
        return ` class="${escapeHtml(blockStyle)}"`;
    }
    return "";
}

function serializeNode(node: JSONContent): string {
    switch (node.type) {
        case "doc":
            return (node.content ?? []).map(serializeNode).join("");

        case "paragraph": {
            const cls = blockStyleClassAttr(node.attrs);
            const inner = serializeInlineContent(node.content);
            return `<p${cls}>${inner}</p>`;
        }

        case "heading": {
            const level = node.attrs?.level ?? 1;
            const cls = blockStyleClassAttr(node.attrs);
            const inner = serializeInlineContent(node.content);
            return `<h${level}${cls}>${inner}</h${level}>`;
        }

        case "bulletList":
            return `<ul>${(node.content ?? []).map(serializeNode).join("")}</ul>`;

        case "orderedList":
            return `<ol>${(node.content ?? []).map(serializeNode).join("")}</ol>`;

        case "listItem": {
            // A listItem in TipTap typically contains a paragraph.
            // We collapse it: the paragraph's blockStyle becomes the <li> class,
            // and the paragraph's inline content becomes the <li> content.
            const paragraph = node.content?.[0];
            if (paragraph?.type === "paragraph") {
                const cls = blockStyleClassAttr(paragraph.attrs);
                const inner = serializeInlineContent(paragraph.content);
                return `<li${cls}>${inner}</li>`;
            }
            // Fallback for non-paragraph content in list items
            const inner = (node.content ?? []).map(serializeNode).join("");
            return `<li>${inner}</li>`;
        }

        default:
            return "";
    }
}

/**
 * Converts TipTap JSONContent to a limited HTML format.
 *
 * The output uses only a restricted set of HTML elements:
 * - Block: `<p>`, `<h1>`–`<h6>`, `<ul>`, `<ol>`, `<li>`
 * - Inline: `<strong>`, `<em>`, `<del>`, `<sup>`, `<sub>`, `<br>`
 * - Links: `<a href="comet-link://...">`
 * - Special chars: `&nbsp;` (non-breaking space), `&shy;` (soft hyphen)
 * - Block styles are encoded as CSS classes on block elements.
 */
export function tipTapContentToHtml(content: JSONContent): string {
    return serializeNode(content);
}
