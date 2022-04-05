import { IMakeRteApiProps, makeRteApi, OnDebouncedContentChangeFn, Rte } from "@comet/admin-rte";
import { Box, Card, CardContent } from "@mui/material";
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
    const [savableContent, setSavableContent] = React.useState<Html>(defaultValue);

    const handleDebouncedContentChange: OnDebouncedContentChangeFn = (innerEditorState, convertStateToRawContent) => {
        setSavableContent(convertStateToRawContent(innerEditorState));
    };
    const { editorState, setEditorState } = useRteApi({ defaultValue, onDebouncedContentChange: handleDebouncedContentChange });

    return (
        <>
            <Box marginBottom={4}>
                <Card variant="outlined">
                    <CardContent>
                        <Rte value={editorState} onChange={setEditorState} />
                    </CardContent>
                </Card>
            </Box>
            <PrintAnything label="Save Value: Html">{savableContent}</PrintAnything>
        </>
    );
}

storiesOf("@comet/admin-rte/save-as", module).add("Save as HTML", () => <Story />);
