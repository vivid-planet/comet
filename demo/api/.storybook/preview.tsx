import { type Preview } from "@storybook/react-vite";
import { Controls, Description, Primary, Stories, Subtitle, Title } from "@storybook/addon-docs/blocks";
import React from "react";

const preview: Preview = {
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: {
            codePanel: true,
            page: () => (
                <>
                    <Title />
                    <Subtitle />
                    <Description />
                    <Primary />
                    <Controls />
                    <Stories includePrimary={false} />
                </>
            ),
        },
    },
};

export default preview;
