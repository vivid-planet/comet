import * as React from "react";

export interface ContentTranslationServiceContext {
    enabled: boolean;
    showDialog: boolean;
    translate: (text: string) => Promise<string>;
}

export const ContentTranslationServiceContext = React.createContext<ContentTranslationServiceContext>({
    enabled: false,
    showDialog: false,
    translate: function (text: string): Promise<string> {
        throw new Error("This is a dummy function for the translation feature that should never be called!");
    },
});
