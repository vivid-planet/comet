import type { Decorator } from "@storybook/react-vite";
import mjml2html from "mjml-browser";
import { MjmlMailRoot, renderToMjml } from "../src/index.ts";

export const MailRendererDecorator: Decorator = (Story) => {
    const mjmlString = renderToMjml(
        <MjmlMailRoot>
            <Story />
        </MjmlMailRoot>,
    );

    const { html, errors: mjmlWarnings } = mjml2html(mjmlString);

    for (const warning of mjmlWarnings) {
        console.warn("MJML warning:", warning);
    }

    return <div dangerouslySetInnerHTML={{ __html: html }} />;
};
