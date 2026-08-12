import { type FC, useEffect, useState } from "react";

interface Props {
    mjmlContent: string;
    /** Applied to the rendered HTML, for mails whose placeholders need substituting before display. */
    transformHtml?: (html: string) => string;
}

export const RenderedMailForBlockPreview: FC<Props> = ({ mjmlContent, transformHtml }) => {
    const [mailHtml, setMailHtml] = useState<string>("");

    useEffect(() => {
        (async () => {
            const { default: mjml2htmlBrowser } = await import("mjml-browser");
            const { html: mjmlHtml, errors } = mjml2htmlBrowser(mjmlContent);

            if (process.env.NODE_ENV === "development") {
                if (errors.length) {
                    console.error(`${errors.length} MJML render errors:`, errors);
                }
            }

            setMailHtml(transformHtml ? transformHtml(mjmlHtml) : mjmlHtml);
        })();
    }, [mjmlContent, transformHtml]);

    return <span dangerouslySetInnerHTML={{ __html: mailHtml }} />;
};
