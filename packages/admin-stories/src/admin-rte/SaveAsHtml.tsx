import { FormPaper } from "@comet/admin";
import { IMakeRteApiProps, makeRteApi, OnDebouncedContentChangeFn, Rte } from "@comet/admin-rte";
import { Box } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import { ContentState, convertFromHTML } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import * as React from "react";

import { PrintAnything } from "./helper";

type Html = string;

const defaultValue: Html = "<p>save-format is <b>HTML</b></p>";

const makeRteApiProps: IMakeRteApiProps<Html> = {
    parse: (v) => {
        const blocksFromHTML = convertFromHTML(v);
        return ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);
    },
    format: (v) => {
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
            <Box marginBottom={4}>
                <FormPaper variant="outlined">
                    <Rte value={editorState} onChange={setEditorState} />
                </FormPaper>
            </Box>
            <PrintAnything label="Save Value: Html">{saveableContent}</PrintAnything>
        </>
    );
}

storiesOf("@comet/admin-rte/save-as", module).add("Save as HTML", () => <Story />);
