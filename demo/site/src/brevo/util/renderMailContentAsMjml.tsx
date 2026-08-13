import { renderToMjml } from "@comet/mail-react";
import type { EmailCampaignContentBlockData } from "@src/blocks.generated";
import { EmailCampaignContentBlock } from "@src/brevo/blocks/EmailCampaignContentBlock";
import type { EmailCampaignConfig } from "@src/brevo/util/getEmailCampaignConfig";
import { MailRoot } from "@src/mail/components/MailRoot";
import { type IntlConfig, IntlProvider } from "react-intl";

interface IntlProviderValues {
    locale: string;
    messages: IntlConfig["messages"];
}

export function renderMailContentAsMjml(
    blockData: EmailCampaignContentBlockData,
    intlProviderValues: IntlProviderValues,
    config: EmailCampaignConfig,
) {
    const { locale, messages } = intlProviderValues;

    return renderToMjml(
        <IntlProvider messages={messages} locale={locale}>
            <MailRoot>
                <EmailCampaignContentBlock content={blockData} config={config} />
            </MailRoot>
        </IntlProvider>,
    );
}
