import { type EmailCampaignContentBlockData } from "@src/blocks.generated";
import { EmailCampaignContentBlock } from "@src/brevo/blocks/EmailCampaignContentBlock";
import { Root } from "@src/brevo/components/Root";
import { type IntlConfig, IntlProvider } from "react-intl";

export interface IntlProviderValues {
    locale: string;
    messages: IntlConfig["messages"];
}

export const generateMjmlMailContent = (blockData: EmailCampaignContentBlockData, intlProviderValues: IntlProviderValues) => {
    const { locale, messages } = intlProviderValues;

    return (
        <IntlProvider messages={messages} locale={locale}>
            <Root>
                <EmailCampaignContentBlock content={blockData} />
            </Root>
        </IntlProvider>
    );
};
