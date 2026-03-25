import type { Decorator } from "@storybook/react-vite";
import React from "react";
import { MjmlMailRoot } from "../src/index.ts";
import { renderMailHtml } from "../src/client/renderMailHtml.js";

export const MailRendererDecorator: Decorator = (Story) => {
    const { html, mjmlWarnings } = renderMailHtml(
        <MjmlMailRoot>
            <Story />
        </MjmlMailRoot>,
    );

    for (const warning of mjmlWarnings) {
        console.warn("MJML warning:", warning);
    }

    return <div dangerouslySetInnerHTML={{ __html: html }} />;
};
