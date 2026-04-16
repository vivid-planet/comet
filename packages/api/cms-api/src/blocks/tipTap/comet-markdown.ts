/**
 * Comet-Flavoured Markdown Parser & Validator
 *
 * Specification:
 * - **bold** → bold
 * - *italic* → italic
 * - ~~strike~~ → strikethrough
 * - ^superscript^ → superscript
 * - ~subscript~ → subscript
 * - &nbsp; (U+00A0) → non-breaking space
 * - &shy; (U+00AD) → soft hyphen
 * - # Heading 1 … ###### Heading 6
 * - Unordered lists: - item
 * - Ordered lists: 1. item
 * - [.styleName] prefix → block style
 * - [Link Text](comet-link://BASE64_JSON) → CMS link
 * - Hard break: trailing backslash + newline
 * - Paragraph separation: blank line
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LinkData = Record<string, any>;

export interface CometMarkdownLink {
    text: string;
    data: LinkData;
    /** Index of the link in the full markdown string, for building JSON paths */
    index: number;
}

export interface MarkdownTextEntry {
    text: string;
    headingLevel?: number;
}

interface MarkdownFeatures {
    hasBold: boolean;
    hasItalic: boolean;
    hasStrike: boolean;
    hasSuperscript: boolean;
    hasSubscript: boolean;
    hasHeading: boolean;
    hasOrderedList: boolean;
    hasUnorderedList: boolean;
    hasNonBreakingSpace: boolean;
    hasSoftHyphen: boolean;
    hasLink: boolean;
    usedBlockStyles: string[];
}

const COMET_LINK_RE = /\[([^[\]]*)\]\(comet-link:\/\/([A-Za-z0-9+/=]+)\)/g;

/**
 * Encode link data as base64-encoded JSON for embedding in markdown
 */
export function encodeLinkData(data: LinkData): string {
    return Buffer.from(JSON.stringify(data)).toString("base64");
}

/**
 * Decode base64-encoded link data from markdown
 */
export function decodeLinkData(encoded: string): LinkData {
    return JSON.parse(Buffer.from(encoded, "base64").toString("utf-8"));
}

/**
 * Collect all comet-link:// links from markdown, returning their data and index
 */
export function collectLinks(markdown: string): CometMarkdownLink[] {
    const results: CometMarkdownLink[] = [];
    const re = new RegExp(COMET_LINK_RE.source, "g");
    let match: RegExpExecArray | null;
    let index = 0;
    while ((match = re.exec(markdown)) !== null) {
        try {
            const data = decodeLinkData(match[2]);
            results.push({ text: match[1], data, index });
        } catch {
            // invalid base64/JSON — will be caught by validation
        }
        index++;
    }
    return results;
}

/**
 * Map all link data in markdown through a transformation function.
 * Returns a new markdown string with updated link data.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapLinksData(markdown: string, fn: (data: LinkData) => any): string {
    const re = new RegExp(COMET_LINK_RE.source, "g");
    return markdown.replace(re, (_fullMatch, text: string, encoded: string) => {
        try {
            const data = decodeLinkData(encoded);
            const newData = fn(data);
            return `[${text}](comet-link://${encodeLinkData(newData)})`;
        } catch {
            return _fullMatch;
        }
    });
}

/**
 * Detect which markdown features are used in the given content
 */
function detectFeatures(markdown: string): MarkdownFeatures {
    const features: MarkdownFeatures = {
        hasBold: false,
        hasItalic: false,
        hasStrike: false,
        hasSuperscript: false,
        hasSubscript: false,
        hasHeading: false,
        hasOrderedList: false,
        hasUnorderedList: false,
        hasNonBreakingSpace: false,
        hasSoftHyphen: false,
        hasLink: false,
        usedBlockStyles: [],
    };

    // Check inline marks - we need to be careful to not confuse bold (**) with italic (*)
    // Bold: **text** (two asterisks)
    if (/\*\*[^*]+\*\*/.test(markdown)) {
        features.hasBold = true;
    }

    // Italic: *text* (single asterisk, not preceded/followed by another asterisk)
    // Match *text* that is not part of **text**
    if (/(?<!\*)\*(?!\*)[^*]+(?<!\*)\*(?!\*)/.test(markdown)) {
        features.hasItalic = true;
    }

    // Strikethrough: ~~text~~
    if (/~~[^~]+~~/.test(markdown)) {
        features.hasStrike = true;
    }

    // Superscript: ^text^
    if (/\^[^^]+\^/.test(markdown)) {
        features.hasSuperscript = true;
    }

    // Subscript: ~text~ (single tilde, not part of ~~)
    if (/(?<!~)~(?!~)[^~]+(?<!~)~(?!~)/.test(markdown)) {
        features.hasSubscript = true;
    }

    // Non-breaking space: U+00A0
    if (markdown.includes("\u00A0")) {
        features.hasNonBreakingSpace = true;
    }

    // Soft hyphen: U+00AD
    if (markdown.includes("\u00AD")) {
        features.hasSoftHyphen = true;
    }

    // Links: [text](comet-link://...)
    if (COMET_LINK_RE.test(markdown)) {
        features.hasLink = true;
    }

    // Parse block-level features line by line
    const lines = markdown.split("\n");
    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed === "") {
            continue;
        }

        // Headings: # text
        if (/^#{1,6}\s/.test(trimmed)) {
            features.hasHeading = true;
        }

        // Ordered list: 1. text
        if (/^\d+\.\s/.test(trimmed)) {
            features.hasOrderedList = true;
        }

        // Unordered list: - text
        if (/^-\s/.test(trimmed)) {
            features.hasUnorderedList = true;
        }

        // Block styles: [.styleName] at start of block content
        // Can appear after heading markers or list markers
        const blockStyleMatch = trimmed.match(/(?:^#{1,6}\s+|^-\s+|^\d+\.\s+)?\[\.([a-zA-Z0-9_-]+)\]/);
        if (blockStyleMatch) {
            const styleName = blockStyleMatch[1];
            if (!features.usedBlockStyles.includes(styleName)) {
                features.usedBlockStyles.push(styleName);
            }
        }
    }

    return features;
}

type TipTapSupports =
    | "bold"
    | "italic"
    | "strike"
    | "sub"
    | "sup"
    | "heading"
    | "ordered-list"
    | "unordered-list"
    | "non-breaking-space"
    | "soft-hyphen"
    | "link";

interface BlockStyle {
    name: string;
    appliesTo?: string[];
}

interface ValidateOptions {
    supports: TipTapSupports[];
    blockStyles: BlockStyle[];
    hasLink: boolean;
}

/**
 * Validate that only allowed features are used in the markdown
 */
function validateFeatures(markdown: string, options: ValidateOptions): boolean {
    const features = detectFeatures(markdown);

    // Check inline features
    if (features.hasBold && !options.supports.includes("bold")) {
        return false;
    }
    if (features.hasItalic && !options.supports.includes("italic")) {
        return false;
    }
    if (features.hasStrike && !options.supports.includes("strike")) {
        return false;
    }
    if (features.hasSuperscript && !options.supports.includes("sup")) {
        return false;
    }
    if (features.hasSubscript && !options.supports.includes("sub")) {
        return false;
    }
    if (features.hasNonBreakingSpace && !options.supports.includes("non-breaking-space")) {
        return false;
    }
    if (features.hasSoftHyphen && !options.supports.includes("soft-hyphen")) {
        return false;
    }

    // Check block features
    if (features.hasHeading && !options.supports.includes("heading")) {
        return false;
    }
    if (features.hasOrderedList && !options.supports.includes("ordered-list")) {
        return false;
    }
    if (features.hasUnorderedList && !options.supports.includes("unordered-list")) {
        return false;
    }

    // Check links
    if (features.hasLink && !options.hasLink) {
        return false;
    }

    // Check block styles
    const allowedStyles = options.blockStyles.map((s) => s.name);
    for (const usedStyle of features.usedBlockStyles) {
        if (!allowedStyles.includes(usedStyle)) {
            return false;
        }
    }

    return true;
}

/**
 * Validate that all comet-link:// data is valid base64-encoded JSON
 */
function validateLinkFormat(markdown: string): boolean {
    const re = new RegExp(COMET_LINK_RE.source, "g");
    let match: RegExpExecArray | null;
    while ((match = re.exec(markdown)) !== null) {
        try {
            decodeLinkData(match[2]);
        } catch {
            return false;
        }
    }
    return true;
}

/**
 * Full validation of comet markdown content
 */
export function validateCometMarkdown(markdown: string, options: ValidateOptions): boolean {
    if (typeof markdown !== "string") {
        return false;
    }

    // Validate link data format
    if (!validateLinkFormat(markdown)) {
        return false;
    }

    // Validate used features against supports config
    if (!validateFeatures(markdown, options)) {
        return false;
    }

    return true;
}

/**
 * Strip all markdown formatting to extract plain text entries with heading levels
 */
export function extractTextEntriesFromMarkdown(markdown: string): MarkdownTextEntry[] {
    const results: MarkdownTextEntry[] = [];
    if (!markdown || typeof markdown !== "string") {
        return results;
    }

    const lines = markdown.split("\n");
    let currentText = "";
    let currentHeadingLevel: number | undefined;

    function flushText() {
        if (currentText.trim()) {
            results.push({ text: stripInlineMarks(currentText.trim()), headingLevel: currentHeadingLevel });
        }
        currentText = "";
        currentHeadingLevel = undefined;
    }

    for (const line of lines) {
        const trimmed = line.trim();

        // Empty line = paragraph separator
        if (trimmed === "") {
            flushText();
            continue;
        }

        // Heading
        const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)/);
        if (headingMatch) {
            flushText();
            currentHeadingLevel = headingMatch[1].length;
            const content = stripBlockStyle(headingMatch[2]);
            currentText = content;
            flushText();
            continue;
        }

        // List item (unordered)
        const ulMatch = trimmed.match(/^-\s+(.*)/);
        if (ulMatch) {
            flushText();
            currentText = stripBlockStyle(ulMatch[1]);
            flushText();
            continue;
        }

        // List item (ordered)
        const olMatch = trimmed.match(/^\d+\.\s+(.*)/);
        if (olMatch) {
            flushText();
            currentText = stripBlockStyle(olMatch[1]);
            flushText();
            continue;
        }

        // Regular paragraph text
        if (currentText) {
            currentText += ` ${stripBlockStyle(trimmed)}`;
        } else {
            currentText = stripBlockStyle(trimmed);
        }
    }
    flushText();

    return results;
}

function stripBlockStyle(text: string): string {
    return text.replace(/^\[\.([a-zA-Z0-9_-]+)\]\s*/, "");
}

function stripInlineMarks(text: string): string {
    let result = text;
    // Remove links: [text](comet-link://...) → text
    result = result.replace(/\[([^[\]]*)\]\(comet-link:\/\/[A-Za-z0-9+/=]+\)/g, "$1");
    // Remove bold: **text** → text
    result = result.replace(/\*\*([^*]+)\*\*/g, "$1");
    // Remove italic: *text* → text
    result = result.replace(/(?<!\*)\*(?!\*)([^*]+)(?<!\*)\*(?!\*)/g, "$1");
    // Remove strike: ~~text~~ → text
    result = result.replace(/~~([^~]+)~~/g, "$1");
    // Remove superscript: ^text^ → text
    result = result.replace(/\^([^^]+)\^/g, "$1");
    // Remove subscript: ~text~ → text
    result = result.replace(/(?<!~)~(?!~)([^~]+)(?<!~)~(?!~)/g, "$1");
    // Replace non-breaking space with regular space
    result = result.replace(/\u00A0/g, " ");
    // Remove soft hyphens
    result = result.replace(/\u00AD/g, "");
    return result;
}
