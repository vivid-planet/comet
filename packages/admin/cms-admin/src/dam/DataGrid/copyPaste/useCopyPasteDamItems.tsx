import { gql, useApolloClient } from "@apollo/client";
import { messages, readClipboardText, writeClipboardText } from "@comet/admin";
import { type ReactNode, useCallback } from "react";
import { FormattedMessage } from "react-intl";

import { useDamScope } from "../../config/useDamScope";
import {
    type GQLCopyPasteFilesMutation,
    type GQLCopyPasteFilesMutationVariables,
    type GQLCopyPasteFoldersMutation,
    type GQLCopyPasteFoldersMutationVariables,
} from "./useCopyPasteDamItems.generated";

interface DamItem {
    id: string;
    type: "file" | "folder";
}

interface DamItemsClipboard {
    damItems: DamItem[];
}

type GetFromClipboardResponse = { canPaste: true; content: DamItemsClipboard } | { canPaste: false; error: ReactNode };

function isDamItemsClipboard(damItemsClipboard: unknown): damItemsClipboard is DamItemsClipboard {
    return (damItemsClipboard as DamItemsClipboard).damItems !== undefined;
}

const copyFilesMutation = gql`
    mutation CopyPasteFiles($fileIds: [ID!]!, $targetFolderId: ID, $targetScope: DamScopeInput) {
        copyDamFiles(fileIds: $fileIds, targetFolderId: $targetFolderId, targetScope: $targetScope) {
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

const copyFoldersMutation = gql`
    mutation CopyPasteFolders($folderIds: [ID!]!, $targetFolderId: ID, $targetScope: DamScopeInput) {
        copyDamFolders(folderIds: $folderIds, targetFolderId: $targetFolderId, targetScope: $targetScope) {
            id
            name
        }
    }
`;

export const useCopyPasteDamItems = () => {
    const scope = useDamScope();
    const apolloClient = useApolloClient();

    const writeToClipboard = useCallback((damItems: Array<{ id: string; type: "file" | "folder" }>) => {
        return writeClipboardText(JSON.stringify({ damItems }));
    }, []);

    const getFromClipboard = useCallback(async (): Promise<GetFromClipboardResponse> => {
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
                        id="comet.dam.cannotPasteItems.messageFailedToParseClipboard"
                        defaultMessage="Content from clipboard aren't valid DAM items"
                    />
                ),
            };
        }
    }, []);

    const createCopies = useCallback(
        async ({ clipboardContent: { damItems }, targetFolderId }: { clipboardContent: DamItemsClipboard; targetFolderId: string | undefined }) => {
            const fileIds = damItems.filter(({ type }) => type === "file").map((file) => file.id);
            const folderIds = damItems.filter(({ type }) => type === "folder").map((folder) => folder.id);

            if (fileIds.length > 0) {
                await apolloClient.mutate<GQLCopyPasteFilesMutation, GQLCopyPasteFilesMutationVariables>({
                    mutation: copyFilesMutation,
                    variables: { fileIds, targetFolderId, targetScope: scope },
                    update: (cache) => {
                        cache.evict({ fieldName: "damItemsList" });
                    },
                });
            }

            if (folderIds.length > 0) {
                await apolloClient.mutate<GQLCopyPasteFoldersMutation, GQLCopyPasteFoldersMutationVariables>({
                    mutation: copyFoldersMutation,
                    variables: { folderIds, targetFolderId, targetScope: scope },
                    update: (cache) => {
                        cache.evict({ fieldName: "damItemsList" });
                    },
                });
            }
        },
        [apolloClient, scope],
    );

    const pasteFromClipboard = useCallback(
        async ({ targetFolderId }: { targetFolderId: string | undefined }) => {
            const clipboard = await getFromClipboard();

            if (clipboard.canPaste) {
                await createCopies({ clipboardContent: clipboard.content, targetFolderId });
                return {};
            } else {
                return { error: clipboard.error };
            }
        },
        [createCopies, getFromClipboard],
    );

    return { writeToClipboard, pasteFromClipboard };
};
