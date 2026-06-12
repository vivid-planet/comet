import { deDE as coreDe, enUS as coreEn } from "@mui/material/locale";
import { deDE as dataGridDe, enUS as dataGridEn } from "@mui/x-data-grid-pro/locales";
import { deDE as datePickersDe, enUS as datePickersEn } from "@mui/x-date-pickers/locales";
import type { Locale } from "date-fns";
import { de, enUS } from "date-fns/locale";
import type { ResolvedIntlConfig } from "react-intl";

import comet_demo_messages_de from "../lang-compiled/comet-demo-lang-admin/de.json";
import comet_demo_messages_en from "../lang-compiled/comet-demo-lang-admin/en.json";
import comet_messages_de from "../lang-compiled/comet-lang/de.json";
import comet_messages_en from "../lang-compiled/comet-lang/en.json";

const supportedLanguages = ["en", "de"] as const;

export type SupportedLanguage = (typeof supportedLanguages)[number];

const fallbackLanguage: SupportedLanguage = "en";

function getClosestSupportedLanguageFromBrowserLanguages(): SupportedLanguage {
    const browserLanguages = typeof navigator !== "undefined" ? (navigator.languages ?? [navigator.language]) : [];

    const language = browserLanguages
        .map((browserLanguage) => browserLanguage.split("-")[0].toLowerCase())
        .find((language): language is SupportedLanguage => supportedLanguages.includes(language as SupportedLanguage));

    return language ?? fallbackLanguage;
}

const cometMessages = {
    en: comet_messages_en,
    de: comet_messages_de,
} satisfies Record<SupportedLanguage, ResolvedIntlConfig["messages"]>;

const cometDemoMessages = {
    en: comet_demo_messages_en,
    de: comet_demo_messages_de,
} satisfies Record<SupportedLanguage, ResolvedIntlConfig["messages"]>;

function getMessages(language: SupportedLanguage): ResolvedIntlConfig["messages"] {
    return {
        ...cometMessages[language],
        ...cometDemoMessages[language],
    };
}

const dateFnsLocales: Record<SupportedLanguage, Locale> = {
    en: enUS,
    de,
};

const muiLocales: Record<SupportedLanguage, object[]> = {
    en: [coreEn, dataGridEn, datePickersEn],
    de: [coreDe, dataGridDe, datePickersDe],
};

export function getLanguageConfig(): {
    language: SupportedLanguage;
    messages: ResolvedIntlConfig["messages"];
    dateFnsLocale: Locale;
    muiLocale: object[];
} {
    const language = getClosestSupportedLanguageFromBrowserLanguages();

    return {
        language,
        messages: getMessages(language),
        dateFnsLocale: dateFnsLocales[language],
        muiLocale: muiLocales[language],
    };
}
