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
