import { DraftDecorator } from "draft-js";

import EditorComponent from "./EditorComponent";

export const ENTITY_TYPE = "LINK";

const Decorator: DraftDecorator = {
    strategy: (contentBlock, callback, contentState) => {
        // findEntities
        contentBlock.findEntityRanges((character) => {
            const entityKey = character.getEntity();
            return entityKey !== null && contentState.getEntity(entityKey).getType() === ENTITY_TYPE;
        }, callback);
    },
    component: EditorComponent,
};

export default Decorator;
