import { type WeightedFullTextValue } from "@mikro-orm/postgresql";

import { type BlockDataInterface } from "../block";
import { FlatBlocks } from "../flat-blocks/flat-blocks";

export interface WeightedSearchText {
    text: string;
    weight: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "other";
}

export type SearchText = string | WeightedSearchText;

function isWeightedText(text: SearchText): text is WeightedSearchText {
    return typeof text !== "string";
}

export function getSearchTextFromBlock(block: BlockDataInterface): WeightedSearchText[] {
    const visitor = new FlatBlocks(block);

    let weightedSearchText: WeightedSearchText[] = [];
    // fill searchData
    visitor.depthFirst().forEach((c) => {
        if (c.visible) {
            const newText = c.block.searchText();
            const newWeightedText: WeightedSearchText[] = newText.map((c) => (isWeightedText(c) ? c : { text: c, weight: "other" }));
            weightedSearchText = [...weightedSearchText, ...newWeightedText];
        }
    });

    return weightedSearchText;
}

export function mikroOrmFullText(fields: WeightedFullTextValue, ...blocks: BlockDataInterface[]): string | WeightedFullTextValue {
    const result: WeightedFullTextValue = { ...fields };
    for (const block of blocks) {
        const blockFullText = blockToMikroOrmFullText(block);
        if (typeof blockFullText !== "string") {
            for (const [key, value] of Object.entries(blockFullText)) {
                const weight = key as keyof WeightedFullTextValue;
                result[weight] = [result[weight], value].filter(Boolean).join(" ");
            }
        }
    }
    if (Object.keys(result).length === 0) {
        return " ";
    }
    return result;
}

export function blockToMikroOrmFullText(block: BlockDataInterface): string | WeightedFullTextValue {
    const weightToPostgresWeight: Record<string, "A" | "B" | "C" | "D"> = {
        h1: "A",
        h2: "B",
        h3: "C",
        h4: "D",
        h5: "D",
        h6: "D",
        other: "D",
    };
    const searchText = getSearchTextFromBlock(block);
    const ret: WeightedFullTextValue = {};
    for (const t of searchText) {
        if (t.text.length > 0) {
            const pgWeight = weightToPostgresWeight[t.weight] || "D";
            ret[pgWeight] = (ret[pgWeight] ? `${ret[pgWeight]} ` : "") + t.text;
        }
    }
    if (Object.keys(ret).length === 0) {
        return " "; // single space: truthy so FullTextType won't convert to null, but to_tsvector('simple', ' ') yields an empty tsvector
    } else {
        return ret;
    }
}
