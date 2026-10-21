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

    for (const line of markdown.split("\n")) {
        if (line.startsWith("## ")) {
            section = line.slice("## ".length).trim();
        } else if (line.startsWith("| `--dextinity-")) {
            const [, tokenCell, descriptionCell = ""] = line.split("|");
            rows.push({ section, tokens: tokenCell.match(tokenNamePattern) ?? [], description: descriptionCell.trim() });
        }
    }

    return rows;
}
