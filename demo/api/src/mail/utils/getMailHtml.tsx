import { renderToMjml } from "@faire/mjml-react/utils/renderToMjml";
import mjml2html from "mjml";
import { type ComponentType } from "react";

export const getMailHtml = <Props extends Record<string, unknown>>(Component: ComponentType<Props>, props: Props) => {
    const mjmlString = renderToMjml(<Component {...props} />);
    const { html, errors } = mjml2html(mjmlString, { validationLevel: "soft" });

    if (process.env.NODE_ENV === "development" && errors.length > 0) {
        console.error(`${errors.length} MJML errors`, errors);
    }

    return html;
};
