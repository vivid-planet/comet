import type { Decorator } from "@storybook/react-vite";
import mjml2html from "mjml-browser";
import { Mjml, MjmlBody, renderToMjml } from "../src/index.ts";

export const MailRendererDecorator: Decorator = (Story) => {
    const mjmlString = renderToMjml(
        <Mjml>
            <MjmlBody>
                <Story />
            </MjmlBody>
        </Mjml>,
    );

    const { html, errors: mjmlWarnings } = mjml2html(mjmlString);

    for (const warning of mjmlWarnings) {
        console.warn("MJML warning:", warning);
    }

    return <div dangerouslySetInnerHTML={{ __html: html }} />;
};
