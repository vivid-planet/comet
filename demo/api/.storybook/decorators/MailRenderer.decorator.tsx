import { renderToMjml } from "@faire/mjml-react/utils/renderToMjml";
import { type Decorator } from "@storybook/react-vite";
import mjml2html from "mjml-browser";
import React from "react";

export const MailRendererDecorator: Decorator = (Story, context) => {
    const mjmlString = renderToMjml(<Story {...context} />);
    const { html, errors } = mjml2html(mjmlString, {
        validationLevel: "soft",
    });

    if (process.env.NODE_ENV === "development" && errors.length > 0) {
        console.error(`${errors.length} MJML errors`, errors);
    }

    return <div dangerouslySetInnerHTML={{ __html: html }} />;
};
