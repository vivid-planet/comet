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

const cometMessages = {
    en: comet_messages_en,
    de: comet_messages_de,
};

const cometDemoMessages = {
    en: comet_demo_messages_en,
    de: comet_demo_messages_de,
};

const supportedLanguages = ["en", "de"] as const;

export type SupportedLanguage = (typeof supportedLanguages)[number];

const fallbackLanguage: SupportedLanguage = "en";

function isSupportedLanguage(language: string): language is SupportedLanguage {
    return supportedLanguages.includes(language as SupportedLanguage);
}

function getClosestSupportedLanguage(): SupportedLanguage {
    const browserLanguages = typeof navigator !== "undefined" ? (navigator.languages ?? [navigator.language]) : [];

    for (const browserLanguage of browserLanguages) {
        const language = browserLanguage.split("-")[0].toLowerCase();
        if (isSupportedLanguage(language)) {
            return language;
        }
    }

    return fallbackLanguage;
}

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

// MUI and MUI X ship their own component translations (date picker, data grid, table pagination, …).
// They are applied through the theme, so the bundles are spread into `createCometTheme` as additional arguments.
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
    const language = getClosestSupportedLanguage();

    return {
        language,
        messages: getMessages(language),
        dateFnsLocale: dateFnsLocales[language],
        muiLocale: muiLocales[language],
    };
}
