import { type Decorator } from "@storybook/react-webpack5";
import { de, enUS } from "date-fns/locale";
import { IntlProvider } from "react-intl";

enum LocaleOption {
    German = "de",
    English = "en",
}

function isLocaleOption(value: any): value is LocaleOption {
    return value === "de" || value === "en";
}

type DateFnsLocale = typeof de;
const dateFnsLocales: Record<LocaleOption, DateFnsLocale> = {
    [LocaleOption.German]: de,
    [LocaleOption.English]: enUS,
};

// @TODO: use messages from lang-package
const messages: Record<LocaleOption, Record<string, string>> = {
    en: {},
    de: {},
};

export const IntlDecorator: Decorator = (fn, context) => {
    const { locale: selectedLocale = LocaleOption.English } = context.globals;
    const selecteDateFnsLocale = isLocaleOption(selectedLocale) ? dateFnsLocales[selectedLocale] : dateFnsLocales.en;

    return (
        <IntlProvider
            locale={selectedLocale}
            messages={isLocaleOption(selectedLocale) ? messages[selectedLocale] : {}}
            onError={() => {
                // disable error logging
            }}
        >
            {fn()}
        </IntlProvider>
    );
};
