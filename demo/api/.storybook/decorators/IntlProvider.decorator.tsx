import { type Decorator } from "@storybook/react-vite";
import { type ResolvedIntlConfig, IntlProvider } from "react-intl";
import messages_de from "../../lang-compiled/comet-demo-api/de.json";
import messages_en from "../../lang-compiled/comet-demo-api/en.json";

export enum LocaleOption {
    DE = "DE",
    EN = "EN",
}

export const getMessages = (language: LocaleOption): ResolvedIntlConfig["messages"] => {
    if (language === LocaleOption.DE) {
        return messages_de;
    }

    return messages_en;
};

export const IntlDecorator: Decorator = (fn, context) => {
    const { locale: selectedLocale = LocaleOption.EN } = context.globals;

    return (
        <IntlProvider
            locale={selectedLocale}
            messages={getMessages(selectedLocale)}
            onError={() => {
                // disable error logging
            }}
        >
            {fn()}
        </IntlProvider>
    );
};
