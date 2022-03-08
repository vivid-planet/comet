import { EditorState } from "draft-js";

import findEntityInCurrentSelection from "./findEntityInCurrentSelection";

// get data for the entity
export default function findEntityDataInCurrentSelection<T extends {} = {}>(editorState: EditorState, entityType: string): T | null {
    const { entity } = findEntityInCurrentSelection(editorState, entityType);

    if (entity) {
        const data = entity.getData() as T;

        return data;
    }
    return null;
}
