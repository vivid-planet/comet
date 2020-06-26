import * as React from "react";
import { IntlProvider } from "react-intl";

type Locale = string;

interface II18nContext {
    locale: Locale;
    setLocale: React.Dispatch<Locale>;
    supportedLocales: Locale[];
}

const I18nContext = React.createContext<II18nContext | null>(null);

interface IProps {
    defaultLocale: Locale;
    supportedLocales: Locale[];
}

const dummyMessagesEn = {
    "app.learn-react-link": "Learn React.",
};

const dummyMessagesDe = {
    "app.learn-react-link": "Lerne React.",
};

export const I18nProvider: React.FC<IProps> = ({ defaultLocale, supportedLocales, children }) => {
    const [locale, setLocale] = React.useState(defaultLocale);
    const messages: Record<Locale, Record<string, string>> = {
        de: dummyMessagesDe,
        en: dummyMessagesEn,
    };

    return (
        <I18nContext.Provider value={{ locale, setLocale, supportedLocales }}>
            <IntlProvider locale={locale} messages={messages[locale] ?? {}}>
                {children}
            </IntlProvider>
        </I18nContext.Provider>
    );
};

export function useI18n(): II18nContext {
    const context = React.useContext(I18nContext);
    if (!context) {
        throw new Error("useI18n must be used inside an I18nProvider");
    }

    return context;
}
