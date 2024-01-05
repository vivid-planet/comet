import { gql, useApolloClient } from "@apollo/client";
import { messages, readClipboardText, writeClipboardText } from "@comet/admin";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { useDamScope } from "../../config/useDamScope";
import { GQLCopyPasteFilesMutation, GQLCopyPasteFilesMutationVariables } from "./useCopyPasteDamItems.generated";

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

const copyFilesMutation = gql`
    mutation CopyPasteFiles($fileIds: [ID!]!, $targetFolderId: ID, $targetScope: DamScopeInput) {
        copyFiles(fileIds: $fileIds, targetFolderId: $targetFolderId, targetScope: $targetScope) {
            mappedFiles {
                rootFile {
                    id
                }
                copy {
                    id
                }
            }
        }
    }
`;

export const useCopyPasteDamItems = () => {
    const currScope = useDamScope();
    const apolloClient = useApolloClient();

    const prepareForClipboard = React.useCallback(
        async (damItems: Array<{ id: string; type: "file" | "folder" }>): Promise<DamItemsClipboard> => {
            return { scope: currScope, damItems };
        },
        [currScope],
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

    const doCopy = React.useCallback(
        async ({
            clipboard: { scope: rootScope, damItems },
            targetFolderId,
        }: {
            clipboard: DamItemsClipboard;
            targetFolderId: string | undefined;
        }) => {
            const fileIds = damItems.filter(({ type }) => type === "file").map((file) => file.id);

            await apolloClient.mutate<GQLCopyPasteFilesMutation, GQLCopyPasteFilesMutationVariables>({
                mutation: copyFilesMutation,
                variables: { fileIds, targetFolderId, targetScope: currScope },
                update: (cache) => {
                    cache.evict({ fieldName: "damItemsList" });
                },
            });
        },
        [apolloClient, currScope],
    );

    return { prepareForClipboard, writeToClipboard, getFromClipboard, doCopy };
};
