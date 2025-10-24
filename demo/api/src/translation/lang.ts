import * as fs from "fs";
import { type ResolvedIntlConfig } from "react-intl";

type Messages = ResolvedIntlConfig["messages"];

const projectMessages: Record<string, Messages> = {
    en: {},
    de: {},
};
export type SupportedLanguage = keyof typeof projectMessages;

Object.keys(projectMessages).forEach((key) => {
    fs.readFile(`lang-compiled/comet-demo-api/${key}.json`, "utf-8", (err, data) => {
        if (err) throw err;
        projectMessages[key] = JSON.parse(data);
    });
});

export const getMessages = (language: keyof typeof projectMessages): Messages => {
    return projectMessages[language];
};
