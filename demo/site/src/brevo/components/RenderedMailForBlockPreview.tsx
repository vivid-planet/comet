import { replaceMailHtmlPlaceholders } from "@src/brevo/util/replaceMailHtmlPlaceholders";
import { type FC, useEffect, useState } from "react";

interface Props {
    mjmlContent: string;
}

export const RenderedMailForBlockPreview: FC<Props> = ({ mjmlContent }) => {
    const [mailHtml, setMailHtml] = useState<string>("");

    useEffect(() => {
        (async () => {
            const { default: mjml2htmlBrowser } = await import("mjml-browser");
            const { html: mjmlHtml, errors } = mjml2htmlBrowser(mjmlContent);
            const html = replaceMailHtmlPlaceholders(mjmlHtml, "preview");

            if (process.env.NODE_ENV === "development") {
                if (errors.length) {
                    console.error(`${errors.length} MJML render errors:`, errors);
                }
            }

            setMailHtml(html);
        })();
    }, [mjmlContent]);

    return <span dangerouslySetInnerHTML={{ __html: mailHtml }} />;
};
