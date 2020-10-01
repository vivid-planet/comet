import { FilterEditorStateBeforeUpdateFn } from "../Rte";
import removeUnsupportedBlocks from "./removeUnsupportedBlocks";
import removeUnsupportedEntities from "./removeUnsupportedEntities";
import removeUnsupportedInlineStyles from "./removeUnsupportedInlineStyles";

const defaultFilterEditorStateBeforeUpdate: FilterEditorStateBeforeUpdateFn = (newState, ctx) => {
    const fns: FilterEditorStateBeforeUpdateFn[] = [removeUnsupportedEntities, removeUnsupportedBlocks, removeUnsupportedInlineStyles];

    const shouldFilter = newState.getLastChangeType() === "insert-fragment";
    if (shouldFilter) {
        // apply all filters from left to right
        return fns.reduce((nextState, filterFn) => filterFn(nextState, ctx), newState);
    }
    return newState;
};

export default defaultFilterEditorStateBeforeUpdate;
