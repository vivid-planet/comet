import type { ContentBlock, ContentState, DraftDecorator } from "draft-js";
import type { ReactNode } from "react";

import { PLACEHOLDER_ENTITY_TYPE } from "../placeholder/constants";

export { PLACEHOLDER_ENTITY_TYPE };

function PlaceholderEditorComponent({ children }: { children: ReactNode }): ReactNode {
    return (
        <span
            style={{
                backgroundColor: "#e8f0fe",
                border: "1px solid #a8c7fa",
                borderRadius: "3px",
                padding: "0 4px",
            }}
        >
            {children}
        </span>
    );
}

export const PlaceholderDecorator: DraftDecorator = {
    strategy: (contentBlock: ContentBlock, callback: (start: number, end: number) => void, contentState: ContentState) => {
        contentBlock.findEntityRanges((character) => {
            const entityKey = character.getEntity();
            return entityKey !== null && contentState.getEntity(entityKey).getType() === PLACEHOLDER_ENTITY_TYPE;
        }, callback);
    },
    component: PlaceholderEditorComponent,
};
