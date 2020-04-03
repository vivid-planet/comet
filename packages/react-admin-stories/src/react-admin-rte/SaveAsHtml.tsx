import { storiesOf } from "@storybook/react";
import { IMakeRteApiProps, makeRteApi, OnDebouncedContentChangeFn, Rte } from "@vivid-planet/react-admin-rte";
import { ContentState, convertFromHTML } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import * as React from "react";
import { PrintAnything, RteLayout } from "./helper";

type Html = string;

const defaultValue: Html = "<p>save-format is <b>HTML</b></p>";

const makeRteApiProps: IMakeRteApiProps<Html> = {
    parse: v => {
        const blocksFromHTML = convertFromHTML(v);
        return ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);
    },
    format: v => {
        return stateToHTML(v);
    },
};

const [useRteApi] = makeRteApi<Html>(makeRteApiProps);

function Story() {
    const [saveableContent, setSaveableContent] = React.useState<Html>(defaultValue);

    const handleDebouncedContentChange: OnDebouncedContentChangeFn = (innerEditorState, convertStateToRawContent) => {
        setSaveableContent(convertStateToRawContent(innerEditorState));
    };
    const { editorState, setEditorState } = useRteApi({ defaultValue, onDebouncedContentChange: handleDebouncedContentChange });

    return (
        <>
            <RteLayout>
                <Rte value={editorState} onChange={setEditorState} />
            </RteLayout>
            <PrintAnything label="Save Value: Html">{saveableContent}</PrintAnything>
        </>
    );
}

storiesOf("react-admin-rte/save-as", module).add("Save as HTML", () => <Story />);
