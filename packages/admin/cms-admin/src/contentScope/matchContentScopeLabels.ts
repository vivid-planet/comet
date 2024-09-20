import escapeRegExp from "lodash.escaperegexp";

import { TextMatch } from "../common/MarkedMatches";

interface MatchContentScopeLabelsParams {
    item: string;
    query: string;
}

export const matchContentScopeLabels = ({ item, query }: MatchContentScopeLabelsParams): Array<TextMatch> => {
    const matches: Array<TextMatch> = [];
    if (!query) {
        return matches;
    }

    const regex = new RegExp(`(${escapeRegExp(query)})`, "gi");

    let match;

    while ((match = regex.exec(item)) !== null) {
        matches.push({
            start: match.index,
            end: match.index + query.length - 1,
            focused: false,
        });
    }

    return matches;
};
