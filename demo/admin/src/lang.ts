import { ResolvedIntlConfig } from "react-intl";

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

export const getMessages = (): ResolvedIntlConfig["messages"] => {
    // in dev mode we use the default messages to have immediate changes
    if (process.env.NODE_ENV === "development") {
        return {};
    }

    return {
        ...cometMessages["en"],
        ...cometDemoMessages["en"],
    };
};
