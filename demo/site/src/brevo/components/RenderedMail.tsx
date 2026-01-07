import { render } from "@faire/mjml-react/utils/render";
import { type EmailCampaignContentBlockData } from "@src/blocks.generated";
import { EmailCampaignContentBlock } from "@src/brevo/blocks/EmailCampaignContentBlock";
import { replaceMailHtmlPlaceholders } from "@src/brevo/util/replaceMailHtmlPlaceholders";
import { IntlProvider } from "@src/util/IntlProvider";
import { type FC, useEffect, useState } from "react";
import { type IntlConfig } from "react-intl";

import { Root } from "./Root";

export interface IntlProviderValues {
    locale: string;
    messages: IntlConfig["messages"];
}

interface Props {
    mjmlContent: string;
}

export const generateMjmlMailContent = (blockData: EmailCampaignContentBlockData, intlProviderValues: IntlProviderValues): string => {
    const { locale, messages } = intlProviderValues;

    const { html } = render(
        <IntlProvider messages={messages} locale={locale}>
            <Root>
                <EmailCampaignContentBlock content={blockData} />
            </Root>
        </IntlProvider>,
    );

    return html;
};

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
