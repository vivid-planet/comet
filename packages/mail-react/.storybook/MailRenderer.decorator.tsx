import type { Decorator } from "@storybook/react-vite";
import mjml2html from "mjml-browser";
import { MjmlMailRoot, renderToMjml } from "../src/index.ts";

export const MailRendererDecorator: Decorator = (Story, context) => {
    const mjmlString = renderToMjml(
        <MjmlMailRoot theme={context.parameters.theme}>
            <Story />
        </MjmlMailRoot>,
    );

    const { html, errors: mjmlWarnings } = mjml2html(mjmlString);

    for (const warning of mjmlWarnings) {
        console.warn("MJML warning:", warning);
    }

    return <div dangerouslySetInnerHTML={{ __html: html }} />;
};
