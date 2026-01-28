import { Controls, Description, Primary, Stories, Subtitle, Title } from "@storybook/addon-docs/blocks";
import { type Preview } from "@storybook/react-vite";
import React from "react";

import { MailRendererDecorator } from "./decorators/MailRenderer.decorator";

const preview: Preview = {
    tags: ["autodocs"],
    decorators: [MailRendererDecorator],
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
