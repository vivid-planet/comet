import { replaceMailHtmlPlaceholders } from "@src/brevo/util/replaceMailHtmlPlaceholders";
import { type FC, useEffect, useState } from "react";

interface Props {
    mjmlContent: string;
}

export const RenderedMail: FC<Props> = ({ mjmlContent }) => {
    const [mailHtml, setMailHtml] = useState<string>("");

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const mjml2htmlBrowser = require("mjml-browser");
        const { html: mjmlHtml, errors } = mjml2htmlBrowser(mjmlContent);
        const html = replaceMailHtmlPlaceholders(mjmlHtml, "preview");

        if (errors.length) {
            console.error(`${errors.length} MJML render errors:`, errors);
        }

        setMailHtml(html);
    }, [mjmlContent]);

    return <span dangerouslySetInnerHTML={{ __html: mailHtml }} />;
};
