import type { Locale } from "date-fns";
import { de, enUS } from "date-fns/locale";
import type { ResolvedIntlConfig } from "react-intl";

import comet_demo_messages_de from "../lang-compiled/comet-demo-lang-admin/de.json";
import comet_demo_messages_en from "../lang-compiled/comet-demo-lang-admin/en.json";
import comet_messages_de from "../lang-compiled/comet-lang/de.json";
import comet_messages_en from "../lang-compiled/comet-lang/en.json";

const cometMessages = {
    en: comet_messages_en,
    de: comet_messages_de,
};

const cometDemoMessages = {
    en: comet_demo_messages_en,
    de: comet_demo_messages_de,
};

export const supportedLanguages = ["en", "de"] as const;

export type SupportedLanguage = (typeof supportedLanguages)[number];

const fallbackLanguage: SupportedLanguage = "en";

function isSupportedLanguage(language: string): language is SupportedLanguage {
    return supportedLanguages.includes(language as SupportedLanguage);
}

export function getClosestSupportedLanguage(): SupportedLanguage {
    const browserLanguages = typeof navigator !== "undefined" ? (navigator.languages ?? [navigator.language]) : [];

    for (const browserLanguage of browserLanguages) {
        const language = browserLanguage.split("-")[0].toLowerCase();
        if (isSupportedLanguage(language)) {
            return language;
        }
    }

    return fallbackLanguage;
}

export const dateFnsLocales: Record<SupportedLanguage, Locale> = {
    en: enUS,
    de,
};

export const getMessages = (language: SupportedLanguage): ResolvedIntlConfig["messages"] => {
    if (language === "de") {
        return {
            ...cometMessages["de"],
            ...cometDemoMessages["de"],
        };
    }

    return {
        ...cometMessages["en"],
        ...cometDemoMessages["en"],
    };
};
