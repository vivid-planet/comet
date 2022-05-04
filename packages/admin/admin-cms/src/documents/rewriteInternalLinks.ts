import cloneDeep from "lodash.clonedeep";
import get from "lodash.get";
import set from "lodash.set";
import objectScan from "object-scan";

import { IdsMap } from "./types";

function rewriteInternalLinks(input: Record<string, unknown>, idsMap: IdsMap): Record<string, unknown> {
    const output = cloneDeep(input);

    const paths = objectScan(["**.targetPageId"], { joined: true })(output);

    if (paths.length === 0) {
        if (process.env.NODE_ENV === "development") {
            const isBlockInputOrState = objectScan(["**.targetPage.id"], { joined: true })(output).length > 0;

            if (isBlockInputOrState) {
                // eslint-disable-next-line no-console
                console.warn(
                    "It seems you're calling rewriteInternalLinks() for a block's input or state. " +
                        "Make sure to call state2Output() before calling rewriteInternalLinks().",
                );
            }
        }
    }

    for (const path of paths) {
        const originalTargetPageId = get(output, path, undefined) as string | undefined;

        if (originalTargetPageId != null) {
            const newTargetPageId = idsMap.get(originalTargetPageId);

            if (newTargetPageId != null) {
                set(output, path, newTargetPageId);
            }
        }
    }

    return output;
}

export { rewriteInternalLinks };
