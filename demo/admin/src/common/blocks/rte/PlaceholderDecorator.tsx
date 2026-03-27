import { type ContentBlock, type ContentState, type DraftDecorator } from "draft-js";
import type { ReactNode } from "react";

export const PLACEHOLDER_ENTITY_TYPE = "PLACEHOLDER";

interface PlaceholderEditorComponentProps {
    children: ReactNode;
    contentState: ContentState;
    entityKey: string;
}

function PlaceholderEditorComponent({ children, contentState, entityKey }: PlaceholderEditorComponentProps): ReactNode {
    const data = contentState.getEntity(entityKey).getData();
    const label = data.field === "price" ? (data.productPrice ?? "Price") : (data.productTitle ?? "Title");

    return (
        <span
            style={{
                backgroundColor: "#e8f0fe",
                border: "1px solid #a8c7fa",
                borderRadius: "3px",
                padding: "0 4px",
            }}
        >
            {/* Render Draft.js children hidden so cursor/selection tracking works for deletion */}
            <span style={{ fontSize: 0, lineHeight: 0, color: "transparent", overflow: "hidden", display: "inline-block", width: 0 }}>
                {children}
            </span>
            {label}
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
