import { IRteReadOnlyOptions, makeRteApi, RteReadOnly } from "@comet/admin-rte";
import { Box, Card, CardContent } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { exampleContent, PrintEditorState } from "./helper";

const [useRteApi] = makeRteApi();

const GreenCustomHeader: React.FC = ({ children }) => <span style={{ color: "green" }}>{children}</span>;

const rteOptions: IRteReadOnlyOptions = {
    blocktypeMap: {
        "header-custom-green": {
            label: "Custom Green Header",
            renderConfig: {
                element: "h1",
                wrapper: <GreenCustomHeader />,
            },
        },
    },
};

function Story() {
    const { editorState } = useRteApi({ defaultValue: JSON.stringify(exampleContent) }); // defaultValue is optional

    return (
        <>
            <Box marginBottom={4}>
                <Card variant="outlined">
                    <CardContent>
                        <RteReadOnly value={editorState} options={rteOptions} />
                    </CardContent>
                </Card>
            </Box>
            <PrintEditorState editorState={editorState} />
        </>
    );
}

storiesOf("@comet/admin-rte", module).add("Rte readonly", () => <Story />);
