import { type Config, renderToMjml } from "@comet/mail-react";
import type { WelcomeEmailContentBlockData } from "@src/blocks.generated";
import { WelcomeEmailContentBlock } from "@src/welcomeEmail/blocks/WelcomeEmailContentBlock";
import { WelcomeEmailRoot } from "@src/welcomeEmail/components/WelcomeEmailRoot";
import { type IntlConfig, IntlProvider } from "react-intl";

interface IntlProviderValues {
    locale: string;
    messages: IntlConfig["messages"];
}

export function renderWelcomeEmailAsMjml(blockData: WelcomeEmailContentBlockData, { locale, messages }: IntlProviderValues, config: Config) {
    return renderToMjml(
        <IntlProvider messages={messages} locale={locale}>
            <WelcomeEmailRoot config={config}>
                <WelcomeEmailContentBlock content={blockData} />
            </WelcomeEmailRoot>
        </IntlProvider>,
    );
}
