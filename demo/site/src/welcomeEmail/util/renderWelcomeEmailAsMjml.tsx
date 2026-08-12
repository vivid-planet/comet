import { renderToMjml } from "@comet/mail-react";
import type { WelcomeEmailContentBlockData } from "@src/blocks.generated";
import { MailRoot } from "@src/mail/components/MailRoot";
import { WelcomeEmailContentBlock } from "@src/welcomeEmail/blocks/WelcomeEmailContentBlock";
import { type IntlConfig, IntlProvider } from "react-intl";

interface IntlProviderValues {
    locale: string;
    messages: IntlConfig["messages"];
}

export function renderWelcomeEmailAsMjml(blockData: WelcomeEmailContentBlockData, intlProviderValues: IntlProviderValues) {
    const { locale, messages } = intlProviderValues;

    return renderToMjml(
        <IntlProvider messages={messages} locale={locale}>
            <MailRoot>
                <WelcomeEmailContentBlock content={blockData} />
            </MailRoot>
        </IntlProvider>,
    );
}
