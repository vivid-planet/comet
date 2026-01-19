import { renderToMjml } from "@faire/mjml-react/utils/renderToMjml";
import { type EmailCampaignContentBlockData } from "@src/blocks.generated";
import { EmailCampaignContentBlock } from "@src/brevo/blocks/EmailCampaignContentBlock";
import { Root } from "@src/brevo/components/Root";
import { type EmailCampaignConfig } from "@src/brevo/util/getEmailCampaignConfig";
import { IntlProvider } from "@src/util/IntlProvider";
import { type IntlConfig } from "react-intl";

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
            <Root>
                <EmailCampaignContentBlock content={blockData} config={config} />
            </Root>
        </IntlProvider>,
    );
}
