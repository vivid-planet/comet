import { ResolvedIntlConfig } from "react-intl";

import blocks_admin_messages_en from "../lang/admin-blocks/en.json";
import cms_admin_messages_en from "../lang/admin-cms/en.json";
import comet_admin_messages_de from "../lang/comet-admin/de.json";
import comet_admin_messages_en from "../lang/comet-admin/en.json";

const blockAdminMessages = {
    en: blocks_admin_messages_en,
};

const cmsAdminMessages = {
    en: cms_admin_messages_en,
};

const cometAdminMessages = {
    en: comet_admin_messages_en,
    de: comet_admin_messages_de,
};

export const getMessages = (): ResolvedIntlConfig["messages"] => {
    // in dev mode we use the default messages to have immediate changes
    if (process.env.NODE_ENV === "development") {
        return {};
    }

    return {
        ...cometAdminMessages["en"],
        ...blockAdminMessages["en"],
        ...cmsAdminMessages["en"] /*...cometDemoAdminMessages["en"]*/,
    };
};
