import { useApolloClient } from "@apollo/client";
import { messages, readClipboardText, writeClipboardText } from "@comet/admin";
import * as React from "react";
import { FormattedMessage } from "react-intl";

interface DamItem {
    id: string;
    type: "file" | "folder";
}

interface DamItemsClipboard {
    damItems: DamItem[];
    scope: Record<string, unknown>;
}

type GetFromClipboardResponse = { canPaste: true; content: DamItemsClipboard } | { canPaste: false; error: React.ReactNode };

function isDamItemsClipboard(damItemsClipboard: unknown): damItemsClipboard is DamItemsClipboard {
    return (damItemsClipboard as DamItemsClipboard).damItems !== undefined;
}

export const useCopyPasteDamItems = ({ scope, currFolderId }: { scope: Record<string, unknown>; currFolderId: string | null }) => {
    const apolloClient = useApolloClient();

    const prepareForClipboard = React.useCallback(
        async (damItems: Array<{ id: string; type: "file" | "folder" }>): Promise<DamItemsClipboard> => {
            return { scope, damItems };
        },
        [scope],
    );

    const writeToClipboard = React.useCallback(async (items: DamItemsClipboard) => {
        return writeClipboardText(JSON.stringify(items));
    }, []);

    const getFromClipboard = React.useCallback(async (): Promise<GetFromClipboardResponse> => {
        const text = await readClipboardText();

        if (text === undefined) {
            return {
                canPaste: false,
                error: <FormattedMessage {...messages.failedToReadClipboard} />,
            };
        }

        if (text.trim() === "") {
            return {
                canPaste: false,
                error: <FormattedMessage {...messages.emptyClipboard} />,
            };
        }

        try {
            const parsedText = JSON.parse(text);
            if (isDamItemsClipboard(parsedText)) {
                return { canPaste: true, content: parsedText };
            } else {
                throw new Error("Invalid clipboard content");
            }
        } catch {
            return {
                canPaste: false,
                error: (
                    <FormattedMessage
                        id="comet.dam.cannotPasteFiles.messageFailedToParseClipboard"
                        defaultMessage="Content from clipboard aren't valid DAM items"
                    />
                ),
            };
        }
    }, []);

    const doCopy = React.useCallback(({ scope: inputScope, damItems }: DamItemsClipboard) => {}, []);

    return { prepareForClipboard, writeToClipboard, getFromClipboard };
};
