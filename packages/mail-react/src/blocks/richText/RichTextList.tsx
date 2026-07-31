import clsx from "clsx";
import type { CSSProperties, ReactNode } from "react";

import { useOutlookTextStyle } from "../../components/text/OutlookTextStyleContext.js";
import { generateResponsiveTextCss } from "../../components/text/textStyles.js";
import { registerStyles } from "../../styles/registerStyles.js";
import { defaultTheme } from "../../theme/defaultTheme.js";
import { getDefaultFromResponsiveValue, getDefaultOrUndefined, getResponsiveOverrides } from "../../theme/responsiveValue.js";
import { useOptionalTheme } from "../../theme/ThemeProvider.js";
import type { TextVariantStyles, Theme, ThemeBreakpoint, ThemeBreakpoints, ThemeList, ThemeText, VariantName } from "../../theme/themeTypes.js";
import { css } from "../../utils/css.js";

const unorderedMarker = "•";

// Variant names come from the consumer, so the `variant` prefix keeps them apart from the package's own modifiers.
function variantModifier(variantName: string): string {
    return `richTextBlock__list--variant${variantName.charAt(0).toUpperCase()}${variantName.slice(1)}`;
}

interface RichTextListItem {
    key: string;
    content: ReactNode;
}

interface RichTextListProps {
    ordered?: boolean;
    variant?: VariantName;
    /** When true, the variant's spacing below the block applies below the last item. */
    bottomSpacing?: boolean;
    items: RichTextListItem[];
}

/** Renders one draft-js list as a table, because cell padding is the only list indent Outlook applies reliably. */
export function RichTextList({ ordered, variant, bottomSpacing, items }: RichTextListProps): ReactNode {
    const theme = useOptionalTheme();
    const outlookTextStyle = useOutlookTextStyle();

    const list = theme?.list ?? defaultTheme.list;
    const themeText: ThemeText = theme?.text ?? {};
    const { defaultVariant, variants, ...baseTextStyles } = themeText;
    const activeVariant = variant ?? defaultVariant;
    const variantStyles = activeVariant ? variants?.[activeVariant] : undefined;
    const mergedStyles: TextVariantStyles = { ...baseTextStyles, ...variantStyles };

    // The HTML parser can move a raw-HTML block's text element out of the table, so spacing set
    // there would not apply to the list. The last row carries it instead.
    const blockSpacing = bottomSpacing ? getDefaultOrUndefined(mergedStyles.bottomSpacing) : undefined;

    // The cells cannot inherit the text styles: once the parser has moved the text element away,
    // the nearest ancestor with a font size is MJML's column, whose font size is zero.
    const fontStyle: CSSProperties = {
        ...outlookTextStyle,
        ...(outlookTextStyle?.lineHeight !== undefined && { msoLineHeightRule: "exactly" }),
    };

    const itemSpacing = getDefaultFromResponsiveValue(list.itemSpacing);
    const markerCellPadding: CSSProperties = {
        paddingLeft: getDefaultFromResponsiveValue(list.indent),
        paddingRight: getDefaultFromResponsiveValue(list.markerGap),
    };

    return (
        <table
            role="presentation"
            cellPadding={0}
            cellSpacing={0}
            border={0}
            width="100%"
            className={clsx("richTextBlock__list", activeVariant && variantModifier(activeVariant))}
            style={{ borderCollapse: "collapse" }}
        >
            <tbody>
                {items.map((item, index) => {
                    const isLastItem = index === items.length - 1;
                    const spacingBelow = isLastItem ? blockSpacing : itemSpacing;
                    const cellStyle: CSSProperties = { ...fontStyle, ...(spacingBelow !== undefined && { paddingBottom: spacingBelow }) };

                    return (
                        <tr
                            key={item.key}
                            className={clsx(
                                "richTextBlock__listItem",
                                !isLastItem && "richTextBlock__listItem--itemSpacing",
                                isLastItem && blockSpacing !== undefined && "richTextBlock__listItem--blockSpacing",
                            )}
                        >
                            <td
                                className="richTextBlock__listItemMarker"
                                align={ordered ? "right" : "left"}
                                valign="top"
                                style={{
                                    ...cellStyle,
                                    ...markerCellPadding,
                                    whiteSpace: "nowrap", // The full-width text cell squeezes this column, so markers such as `10.` must stay on one line.
                                }}
                            >
                                {ordered ? `${index + 1}.` : unorderedMarker}
                            </td>
                            <td className="richTextBlock__listItemText" width="100%" valign="top" style={cellStyle}>
                                {item.content}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

export function generateRichTextListStyles(theme: Theme): string {
    return [
        generateResponsiveListSpacingCss(theme),
        generateResponsiveTextCss(theme, {
            styleSelector: (variantName) =>
                `.${variantModifier(variantName)} .richTextBlock__listItemMarker, .${variantModifier(variantName)} .richTextBlock__listItemText`,
            spacingSelector: (variantName) => `.${variantModifier(variantName)} .richTextBlock__listItem--blockSpacing > td`,
        }),
    ]
        .filter(Boolean)
        .join("\n");
}

type DeclarationsBySelector = Map<string, string[]>;

const listSpacingProperties: Array<{ token: keyof ThemeList; selector: string; cssProperty: string }> = [
    { token: "indent", selector: ".richTextBlock__listItemMarker", cssProperty: "padding-left" },
    { token: "markerGap", selector: ".richTextBlock__listItemMarker", cssProperty: "padding-right" },
    { token: "itemSpacing", selector: ".richTextBlock__listItem--itemSpacing > td", cssProperty: "padding-bottom" },
];

function generateResponsiveListSpacingCss(theme: Theme): string {
    return [...groupListSpacingOverridesByBreakpoint(theme.list)]
        .map(([breakpointKey, declarationsBySelector]) => {
            const breakpoint = theme.breakpoints[breakpointKey];
            return breakpoint ? renderMediaQuery(breakpoint, declarationsBySelector) : "";
        })
        .filter(Boolean)
        .join("\n");
}

function groupListSpacingOverridesByBreakpoint(list: ThemeList): Map<keyof ThemeBreakpoints, DeclarationsBySelector> {
    const declarationsByBreakpoint = new Map<keyof ThemeBreakpoints, DeclarationsBySelector>();

    for (const { token, selector, cssProperty } of listSpacingProperties) {
        for (const override of getResponsiveOverrides(list[token])) {
            const declarationsBySelector = declarationsByBreakpoint.get(override.breakpointKey) ?? new Map<string, string[]>();
            const declarations = declarationsBySelector.get(selector) ?? [];

            declarations.push(`${cssProperty}: ${String(override.value)}px !important`);
            declarationsBySelector.set(selector, declarations);
            declarationsByBreakpoint.set(override.breakpointKey, declarationsBySelector);
        }
    }

    return declarationsByBreakpoint;
}

function renderMediaQuery(breakpoint: ThemeBreakpoint, declarationsBySelector: DeclarationsBySelector): string {
    const rules = [...declarationsBySelector]
        .map(
            ([selector, declarations]) => css`
                ${selector} {
                    ${declarations.join(";\n")}
                }
            `,
        )
        .join("\n");

    return css`
        ${breakpoint.belowMediaQuery} {
            ${rules}
        }
    `;
}

registerStyles(generateRichTextListStyles);
