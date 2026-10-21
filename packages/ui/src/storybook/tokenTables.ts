export const tokenNamePattern = /--dextinity-[a-z0-9-]+/g;

export interface TokenTableRow {
    /** The `##` heading the table is under, such as "Color". */
    section: string;
    /** The tokens in the row's first cell. */
    tokens: string[];
    /** The row's second cell, as Markdown. */
    description: string;
}

/** The rows of a Markdown page's tables that list design tokens in their first column. */
export function readTokenTableRows(markdown: string): TokenTableRow[] {
    const rows: TokenTableRow[] = [];
    let section = "";
    let isInCodeBlock = false;

    for (const line of markdown.split(/\r?\n/)) {
        if (/^(```|~~~)/.test(line)) {
            isInCodeBlock = !isInCodeBlock;
        } else if (!isInCodeBlock && line.startsWith("## ")) {
            section = line.slice("## ".length).trim();
        } else if (!isInCodeBlock && line.startsWith("| `--dextinity-")) {
            const [, tokenCell, descriptionCell = ""] = line.split(/(?<!\\)\|/);
            rows.push({ section, tokens: tokenCell.match(tokenNamePattern) ?? [], description: descriptionCell.trim().replaceAll("\\|", "|") });
        }
    }

    return rows;
}
