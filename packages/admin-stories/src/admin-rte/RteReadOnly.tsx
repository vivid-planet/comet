import { IRteReadOnlyOptions, makeRteApi, RteReadOnly } from "@comet/admin-rte";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { exampleContent, PrintEditorState, RteLayout } from "./helper";

const [useRteApi] = makeRteApi();

const GreenCustomHeader: React.FC = ({ children }) => <span style={{ color: "green" }}>{children}</span>;

const rteOptions: IRteReadOnlyOptions = {
    customBlockMap: {
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
            <RteLayout>
                <RteReadOnly value={editorState} options={rteOptions} />
            </RteLayout>
            <PrintEditorState editorState={editorState} />
        </>
    );
}

storiesOf("@comet/admin-rte", module).add("Rte readonly", () => <Story />);
