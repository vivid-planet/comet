import { type CSSProperties, Fragment, type RefObject, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";

import designTokensPage from "../docs/DesignTokens.mdx?raw";
import { getStyleVersion, subscribeToStyleChanges } from "./styleChanges";
import styles from "./tokenOverview.module.css";
import { readTokenTableRows, type TokenTableRow } from "./tokenTables";

const documentedRows = readTokenTableRows(designTokensPage);

const colorSchemes = ["light", "dark"] as const;

const textStyleProperties = ["font-size", "line-height", "font-weight", "letter-spacing", "text-transform"];

interface ThemeProps {
    theme: string;
    colorScheme: string;
}

/** Every color token of the theme, with its value in the light and in the dark color scheme. */
export function ColorTokenTable({ theme }: Pick<ThemeProps, "theme">) {
    return (
        <table className={styles.table} aria-label="Color tokens">
            <thead>
                <tr>
                    <th scope="col">Token</th>
                    {colorSchemes.map((colorScheme) => (
                        <th key={colorScheme} scope="col" className={styles.valueColumn}>
                            {colorScheme === "light" ? "Light" : "Dark"}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rowsOfSection("Color").map((row) => (
                    <tr key={row.tokens[0]}>
                        <TokenHeaderCell row={row} />
                        {colorSchemes.map((colorScheme) => (
                            <td key={colorScheme}>
                                <ColorValue token={row.tokens[0]} theme={theme} colorScheme={colorScheme} />
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

function ColorValue({ token, theme, colorScheme }: { token: string } & ThemeProps) {
    const swatchRef = useRef<HTMLSpanElement>(null);
    const value = useTokenValue({ elementRef: swatchRef, token, themeKey: `${theme} ${colorScheme}` });

    return (
        <span className={styles.value}>
            <span
                ref={swatchRef}
                className={styles.swatch}
                data-dextinity-theme={theme}
                data-dextinity-color-scheme={colorScheme}
                style={{ background: `var(${token})` }}
            />
            <code>{value}</code>
        </span>
    );
}

/** The tokens of a section of "Foundations/Design tokens", each with a preview and its value. */
export function TokenTable({ section, theme, colorScheme }: { section: string } & ThemeProps) {
    return (
        <table className={styles.table} aria-label={`${section} tokens`}>
            <thead>
                <tr>
                    <th scope="col">Token</th>
                    <th scope="col" className={styles.valueColumn}>
                        Value
                    </th>
                </tr>
            </thead>
            <tbody>
                {rowsOfSection(section).map((row) => (
                    <tr key={row.tokens[0]}>
                        <TokenHeaderCell row={row} />
                        <td>
                            <TokenValue token={row.tokens[0]} themeKey={`${theme} ${colorScheme}`} />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

function TokenValue({ token, themeKey }: { token: string; themeKey: string }) {
    const valueRef = useRef<HTMLElement>(null);
    const value = useTokenValue({ elementRef: valueRef, token, themeKey });

    return (
        <span className={styles.value}>
            <TokenPreview token={token} />
            <code ref={valueRef}>{value}</code>
        </span>
    );
}

function TokenPreview({ token }: { token: string }) {
    const variable = `var(${token})`;

    if (/-(background|foreground|border|focus-ring)(-hover)?$/.test(token)) {
        return <span className={styles.swatch} style={{ background: variable }} />;
    }
    if (token.includes("shadow")) {
        return <span className={styles.shadowSample} style={{ boxShadow: variable }} />;
    }
    if (token.includes("radius")) {
        return <span className={styles.radiusSample} style={{ borderRadius: variable }} />;
    }
    if (token.includes("focus-ring")) {
        return <span className={styles.focusRingSample} />;
    }
    if (token.includes("opacity")) {
        return <span className={styles.swatch} style={{ background: "var(--dextinity-color-primary)", opacity: variable }} />;
    }
    if (/-font-(size|weight|family)/.test(token)) {
        const style: CSSProperties = token.includes("font-size")
            ? { fontSize: variable }
            : token.includes("font-weight")
              ? { fontWeight: variable }
              : { fontFamily: variable };
        return (
            <span className={styles.textSample} style={style}>
                Aa
            </span>
        );
    }
    if (/-(space|padding-inline|height|size|width)(-|$)/.test(token)) {
        return <span className={styles.lengthSample} style={{ width: variable }} />;
    }
    return null;
}

/** The theme's text styles, each as a sample with its values, and its font families. */
export function TextStyleList({ theme, colorScheme }: ThemeProps) {
    const themeKey = `${theme} ${colorScheme}`;
    const typographyRows = rowsOfSection("Typography");
    const fontFamilyRows = typographyRows.filter((row) => row.tokens[0].includes("font-family"));

    return (
        <div className={styles.textStyles}>
            <table className={styles.table} aria-label="Font family tokens">
                <tbody>
                    {fontFamilyRows.map((row) => (
                        <tr key={row.tokens[0]}>
                            <TokenHeaderCell row={row} />
                            <td>
                                <TokenValue token={row.tokens[0]} themeKey={themeKey} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {textStyles(typographyRows).map((textStyle) => (
                <TextStyleSample key={textStyle.name} textStyle={textStyle} themeKey={themeKey} />
            ))}
        </div>
    );
}

interface TextStyle {
    name: string;
    description: string;
    tokens: Record<string, string>;
}

function textStyles(typographyRows: TokenTableRow[]) {
    const textStylesByName = new Map<string, TextStyle>();

    for (const row of typographyRows) {
        const token = row.tokens[0];
        const property = textStyleProperties.find((textStyleProperty) => token.endsWith(`-${textStyleProperty}`));
        if (property === undefined) {
            continue;
        }
        const name = token.slice("--dextinity-typography-".length, -`-${property}`.length);
        const textStyle = textStylesByName.get(name) ?? { name, description: "", tokens: {} };
        textStyle.tokens[property] = token;
        textStyle.description ||= row.description;
        textStylesByName.set(name, textStyle);
    }

    return [...textStylesByName.values()];
}

function TextStyleSample({ textStyle, themeKey }: { textStyle: TextStyle; themeKey: string }) {
    const sampleRef = useRef<HTMLParagraphElement>(null);
    const values = useTokenValues({ elementRef: sampleRef, tokens: Object.values(textStyle.tokens), themeKey });
    const usesHeadingFont = textStyle.name === "display" || textStyle.name.startsWith("heading");
    const style: CSSProperties = {
        fontFamily: `var(--dextinity-font-family-${usesHeadingFont ? "heading" : "body"})`,
        fontSize: `var(${textStyle.tokens["font-size"]})`,
        lineHeight: `var(${textStyle.tokens["line-height"]})`,
        fontWeight: `var(${textStyle.tokens["font-weight"]})`,
        letterSpacing: `var(${textStyle.tokens["letter-spacing"]})`,
        textTransform: textStyle.tokens["text-transform"]
            ? (`var(${textStyle.tokens["text-transform"]})` as CSSProperties["textTransform"])
            : undefined,
    };

    return (
        <section className={styles.textStyle} aria-label={textStyle.name}>
            <div className={styles.textStyleHeader}>
                <code className={styles.tokenName}>{`--dextinity-typography-${textStyle.name}-*`}</code>
                <span className={styles.textStyleValues}>
                    {Object.entries(textStyle.tokens).map(([property, token]) => (
                        <span key={property}>
                            {property.replace("-", " ")} <code>{values[token]}</code>
                        </span>
                    ))}
                </span>
            </div>
            <p ref={sampleRef} className={styles.textStyleSample} style={style}>
                Linen shirts and straw hats for warm days
            </p>
            {textStyle.description !== "" && <Description markdown={textStyle.description} />}
        </section>
    );
}

function TokenHeaderCell({ row }: { row: TokenTableRow }) {
    return (
        <th scope="row" className={styles.tokenCell}>
            <code className={styles.tokenName}>{row.tokens[0]}</code>
            {row.description !== "" && <Description markdown={row.description} />}
        </th>
    );
}

/** Renders a table cell's Markdown, which only uses code spans. */
function Description({ markdown }: { markdown: string }) {
    return (
        <span className={styles.description}>
            {markdown.split("`").map((part, index) => {
                const isCode = index % 2 === 1;
                return <Fragment key={`${index}:${part}`}>{isCode ? <code>{part}</code> : part}</Fragment>;
            })}
        </span>
    );
}

function rowsOfSection(section: string) {
    return documentedRows.filter((row) => row.section === section);
}

/** A token's value where the element is, which follows the theme and color scheme it's in. */
function useTokenValue({ elementRef, token, themeKey }: { elementRef: RefObject<HTMLElement | null>; token: string; themeKey: string }) {
    return useTokenValues({ elementRef, tokens: [token], themeKey })[token] ?? "";
}

function useTokenValues({ elementRef, tokens, themeKey }: { elementRef: RefObject<HTMLElement | null>; tokens: string[]; themeKey: string }) {
    const [values, setValues] = useState<Record<string, string>>({});
    const tokensKey = tokens.join(" ");
    const styleVersion = useSyncExternalStore(subscribeToStyleChanges, getStyleVersion);

    useLayoutEffect(() => {
        if (elementRef.current === null) {
            return;
        }
        const computedStyle = getComputedStyle(elementRef.current);
        setValues(Object.fromEntries(tokensKey.split(" ").map((token) => [token, computedStyle.getPropertyValue(token).trim()])));
    }, [elementRef, tokensKey, themeKey, styleVersion]);

    return values;
}
