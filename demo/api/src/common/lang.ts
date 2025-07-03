import { type ResolvedIntlConfig } from "react-intl";

// eslint-disable-next-line @comet/no-other-module-relative-import
import project_messages_de from "../../lang-compiled/comet-demo-api/de.json";
// eslint-disable-next-line @comet/no-other-module-relative-import
import project_messages_en from "../../lang-compiled/comet-demo-api/en.json";

type Messages = ResolvedIntlConfig["messages"];

const projectMessages = {
    en: project_messages_en,
    de: project_messages_de,
};
export type SupportedLanguage = keyof typeof projectMessages;

export const getMessages = (language: keyof typeof projectMessages): Messages => {
    return projectMessages[language];
};
