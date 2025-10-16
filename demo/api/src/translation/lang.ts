import * as fs from "fs";
import { type ResolvedIntlConfig } from "react-intl";

type Messages = ResolvedIntlConfig["messages"];

const projectMessages = {
    en: JSON.parse(fs.readFileSync("lang-compiled/comet-demo-api/en.json", "utf-8")),
    de: JSON.parse(fs.readFileSync("lang-compiled/comet-demo-api/de.json", "utf-8")),
};
export type SupportedLanguage = keyof typeof projectMessages;

export const getMessages = (language: keyof typeof projectMessages): Messages => {
    return projectMessages[language];
};
