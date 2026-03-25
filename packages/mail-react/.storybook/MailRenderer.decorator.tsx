import type { Decorator } from "@storybook/react-vite";
import React from "react";
import { MjmlMailRoot } from "../src/index.ts";
import { renderMailHtml } from "../src/client/renderMailHtml.js";

export const MailRendererDecorator: Decorator = (Story, context) => {
    const { html, mjmlWarnings } = renderMailHtml(
        <MjmlMailRoot theme={context.parameters.theme}>
            <Story />
        </MjmlMailRoot>,
    );

    for (const warning of mjmlWarnings) {
        console.warn("MJML warning:", warning);
    }

    return <div dangerouslySetInnerHTML={{ __html: html }} />;
};
