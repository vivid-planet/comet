import { type Config, renderToMjml } from "@comet/mail-react";
import type { EmailCampaignContentBlockData } from "@src/blocks.generated";
import { EmailCampaignContentBlock } from "@src/brevo/blocks/EmailCampaignContentBlock";
import { MailRoot } from "@src/mail/components/MailRoot";
import { type IntlConfig, IntlProvider } from "react-intl";

interface IntlProviderValues {
    locale: string;
    messages: IntlConfig["messages"];
}

export function renderMailContentAsMjml(blockData: EmailCampaignContentBlockData, intlProviderValues: IntlProviderValues, config: Config) {
    const { locale, messages } = intlProviderValues;

    return renderToMjml(
        <IntlProvider messages={messages} locale={locale}>
            <MailRoot config={config}>
                <EmailCampaignContentBlock content={blockData} />
            </MailRoot>
        </IntlProvider>,
    );
}
