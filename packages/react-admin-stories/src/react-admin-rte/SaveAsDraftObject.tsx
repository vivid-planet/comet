import { storiesOf } from "@storybook/react";
import { IMakeRteApiProps, makeRteApi, OnDebouncedContentChangeFn, Rte } from "@vivid-planet/react-admin-rte";
import { convertFromRaw, convertToRaw, RawDraftContentState } from "draft-js";
import * as React from "react";
import { PrintAnything, RteLayout } from "./helper";

const defaultValue: RawDraftContentState = {
    blocks: [
        {
            key: "3v61q",
            text: "save-format is rawDraftJsObject",
            type: "unstyled",
            depth: 0,
            inlineStyleRanges: [
                {
                    offset: 15,
                    length: 16,
                    style: "BOLD",
                },
            ],
            entityRanges: [],
            data: {},
        },
        {
            key: "7cbdf",
            text: "",
            type: "unstyled",
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
        },
    ],
    entityMap: {},
};

const makeRteApiProps: IMakeRteApiProps<RawDraftContentState> = {
    parse: v => convertFromRaw(v),
    format: v => convertToRaw(v),
};

const [useRteApi] = makeRteApi<RawDraftContentState>(makeRteApiProps);

function Story() {
    const [saveableContent, setSaveableContent] = React.useState<RawDraftContentState>(defaultValue);

    const handleDebouncedContentChange: OnDebouncedContentChangeFn = (innerEditorState, convertStateToRawContent) => {
        setSaveableContent(convertStateToRawContent(innerEditorState));
    };
    const { editorState, setEditorState } = useRteApi({ defaultValue, onDebouncedContentChange: handleDebouncedContentChange });

    return (
        <>
            <RteLayout>
                <Rte value={editorState} onChange={setEditorState} />
            </RteLayout>
            <PrintAnything label="Save Value: RawDraftJs (not stringified)">{saveableContent}</PrintAnything>
        </>
    );
}

storiesOf("react-admin-rte/save-as", module).add("Save as Raw DraftJs Object", () => <Story />);
