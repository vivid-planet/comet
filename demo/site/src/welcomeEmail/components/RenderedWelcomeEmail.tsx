"use client";

import { type FC, useEffect, useMemo, useState } from "react";

interface Props {
    mjmlContent: string;
}

export const RenderedWelcomeEmail: FC<Props> = ({ mjmlContent }) => {
    const [mailHtml, setMailHtml] = useState<string>("");

    useEffect(() => {
        (async () => {
            const { default: mjml2htmlBrowser } = await import("mjml-browser");
            const { html, errors } = mjml2htmlBrowser(mjmlContent);

            if (process.env.NODE_ENV === "development" && errors.length) {
                console.error(`${errors.length} MJML render errors:`, errors);
            }

            setMailHtml(html);
        })();
    }, [mjmlContent]);

    // Memoize the injected element so hover/selection updates from the block form (which re-render
    // this component via useIFrameBridge) don't re-inject unchanged mail HTML and cause flickering.
    return useMemo(() => <span dangerouslySetInnerHTML={{ __html: mailHtml }} />, [mailHtml]);
};
