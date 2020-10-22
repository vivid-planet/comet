import { DraftBlockType, DraftEntityType, Editor as DraftJsEditor, EditorProps as DraftJsEditorProps } from "draft-js";
import { FilterEditorStateBeforeUpdateFn, SupportedThings } from "../Rte";
import { FilterEditorStateFn, InlineStyleType } from "../types";
import removeEntities from "./utils/removeEntities";
import unstyleBlocks from "./utils/unstyleBlocks";

const removeUnsupportedEntities: FilterEditorStateBeforeUpdateFn = (newState, { supports }) => {
    // remove links and images
    return removeEntities(entity => {
        const unsupportedCoreEntities: DraftEntityType[] = ["IMAGE", "TOKEN", "PHOTO"];
        if (unsupportedCoreEntities.includes(entity.getType())) {
            return false;
        }

        if (!supports.includes("link")) {
            if (entity.getType() === "LINK") {
                return false;
            }
        }
        return true;
    })(newState);
};

export default removeUnsupportedEntities;
