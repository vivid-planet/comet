import { type EditorState, type EntityInstance, SelectionState } from "draft-js";

import rangesIntersect from "./rangesIntersect";
import selectionIsInOneBlock from "./selectionIsInOneBlock";

//
// Searches for entities in the current selection
// If entity found, we return the first entity found and a selection of this entity and the text of this entity
//
export default function findEntityInCurrentSelection(
    editorState: EditorState,
    entityType: string,
): { entity: EntityInstance | null; entitySelection: SelectionState | null; entityText: string | null; entityKey: null | string } {
    // we dont support selections over multiple content blocks
    if (!selectionIsInOneBlock(editorState)) {
        return { entity: null, entitySelection: null, entityText: null, entityKey: null };
    }
    // get the contentBlock of the selection
    const contentState = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const startKey = selection.getStartKey();
    const blockAtBeginning = contentState.getBlockForKey(startKey);

    // we try to find one link entity in the selection
    let entityText = "";
    let entityKey: string | null = null;
    let entitySelection: SelectionState | null = null;
    let firstFoundLinkEntity: EntityInstance | null = null;

    // iterating over all entity ranges in the block
    blockAtBeginning.findEntityRanges(
        (char) => {
            // we are only interested in entities of type {entityType}
            if (char.getEntity()) {
                const entity = contentState.getEntity(char.getEntity());
                if (entity.getType() === entityType) {
                    return true;
                }
            }
            return false;
        },
        (start, end) => {
            if (!firstFoundLinkEntity) {
                // if we 've found one already we're done
                if (rangesIntersect([selection.getStartOffset(), selection.getEndOffset()], [start, end])) {
                    // we are only interested in entities within the current selection
                    const innerEntityKey = blockAtBeginning.getEntityAt(start);
                    const entity = contentState.getEntity(innerEntityKey);

                    // ok, the entity is in the current selection, this is our match: firstFoundLinkEntity
                    // we also build a selection which selects the text for the firstFoundLinkEntity
                    if (entity) {
                        firstFoundLinkEntity = entity;
                        entityText = blockAtBeginning.getText().slice(start, end);
                        entityKey = innerEntityKey;
                        entitySelection = new SelectionState({
                            anchorKey: startKey,
                            anchorOffset: start,
                            focusKey: startKey, // must be same as anchor key
                            focusOffset: end,
                        });
                    }
                }
            }
        },
    );

    if (firstFoundLinkEntity) {
        return { entity: firstFoundLinkEntity, entitySelection, entityText, entityKey };
    } else {
        return { entity: null, entitySelection: null, entityText: null, entityKey: null };
    }
}
