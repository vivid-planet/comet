import parse, { type DOMNode, domToReact, type Element, type HTMLReactParserOptions } from "html-react-parser";
import { type ComponentType, type ReactNode } from "react";

/**
 * Configuration for rendering comet-link:// URLs.
 */
export interface TipTapLinkRendererProps {
    /** The decoded link data from the comet-link:// URL. */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    children: ReactNode;
    className?: string;
}

/**
 * Maps HTML elements to custom React components.
 */
export interface TipTapElementRenderers {
    /** Render a paragraph. Receives className (block style) if set. */
    paragraph?: ComponentType<{ className?: string; children?: ReactNode }>;
    /** Render a heading. Receives level (1-6) and className (block style) if set. */
    heading?: ComponentType<{ level: number; className?: string; children?: ReactNode }>;
    /** Render an unordered list. */
    unorderedList?: ComponentType<{ children?: ReactNode }>;
    /** Render an ordered list. */
    orderedList?: ComponentType<{ children?: ReactNode }>;
    /** Render a list item. Receives className (block style) if set. */
    listItem?: ComponentType<{ className?: string; children?: ReactNode }>;
    /** Render a comet-link:// anchor. */
    link?: ComponentType<TipTapLinkRendererProps>;
}

export interface TipTapRichTextBlockRendererProps {
    /** The HTML content string from the TipTapRichTextBlock. */
    html: string;
    /** Custom renderers for HTML elements. */
    renderers?: TipTapElementRenderers;
}

function isElement(node: DOMNode): node is Element {
    return node.type === "tag";
}

function decodeCometLink(href: string): unknown | null {
    if (!href.startsWith("comet-link://")) {
        return null;
    }
    try {
        const encoded = href.slice("comet-link://".length);
        return JSON.parse(decodeURIComponent(encoded));
    } catch {
        return null;
    }
}

/**
 * Renders TipTapRichTextBlock HTML content as React components.
 *
 * Uses `html-react-parser` to parse the limited HTML format and map elements
 * to custom React components via the `renderers` prop.
 *
 * Handles:
 * - Block elements: `<p>`, `<h1>`–`<h6>`, `<ul>`, `<ol>`, `<li>`
 * - Inline marks: `<strong>`, `<em>`, `<del>`, `<sup>`, `<sub>`, `<br>`
 * - Links: `<a href="comet-link://...">` decoded and rendered via custom link renderer
 * - Block styles: CSS classes on block elements passed as `className`
 */
export function TipTapRichTextBlockRenderer({ html, renderers = {} }: TipTapRichTextBlockRendererProps): ReactNode {
    if (!html) {
        return null;
    }

    const options: HTMLReactParserOptions = {
        replace: (domNode) => {
            if (!isElement(domNode)) {
                return undefined;
            }

            const tag = domNode.name;
            const className = domNode.attribs?.class || undefined;
            const children = domToReact(domNode.children as DOMNode[], options);

            // Paragraph
            if (tag === "p" && renderers.paragraph) {
                const Paragraph = renderers.paragraph;
                return <Paragraph className={className}>{children}</Paragraph>;
            }

            // Headings
            if (/^h[1-6]$/.test(tag) && renderers.heading) {
                const level = parseInt(tag[1], 10);
                const Heading = renderers.heading;
                return (
                    <Heading level={level} className={className}>
                        {children}
                    </Heading>
                );
            }

            // Unordered list
            if (tag === "ul" && renderers.unorderedList) {
                const UL = renderers.unorderedList;
                return <UL>{children}</UL>;
            }

            // Ordered list
            if (tag === "ol" && renderers.orderedList) {
                const OL = renderers.orderedList;
                return <OL>{children}</OL>;
            }

            // List item
            if (tag === "li" && renderers.listItem) {
                const LI = renderers.listItem;
                return <LI className={className}>{children}</LI>;
            }

            // Link
            if (tag === "a" && renderers.link) {
                const href = domNode.attribs?.href;
                if (href) {
                    const linkData = decodeCometLink(href);
                    if (linkData !== null) {
                        const Link = renderers.link;
                        return (
                            <Link data={linkData} className={className}>
                                {children}
                            </Link>
                        );
                    }
                }
            }

            // All other elements (strong, em, del, sup, sub, br) are rendered as-is
            return undefined;
        },
    };

    return <>{parse(html, options)}</>;
}
