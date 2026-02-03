import { renderToMjml } from "@comet/mail-react";
import { type Decorator } from "@storybook/react-vite";
import mjml2html from "mjml-browser";
import React from "react";
import { IntlProvider } from "react-intl";

export const MailRendererDecorator: Decorator = (Story, context) => {
    const mjmlString = renderToMjml(
        <IntlProvider locale="en" defaultLocale="en" messages={{}}>
            <Story {...context} />
        </IntlProvider>,
    );
    const { html, errors } = mjml2html(mjmlString, {
        validationLevel: "soft",
    });

    if (process.env.NODE_ENV === "development" && errors.length > 0) {
        console.error(`${errors.length} MJML errors`, errors);
    }

    return <div dangerouslySetInnerHTML={{ __html: html }} />;
};
