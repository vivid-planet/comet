import { type ResolvedIntlConfig } from "react-intl";

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

export const getMessages = (language: "de" | "en"): ResolvedIntlConfig["messages"] => {
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
