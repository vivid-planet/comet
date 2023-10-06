import { gql, useApolloClient } from "@apollo/client";
import { messages, readClipboardText, writeClipboardText } from "@comet/admin";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { PagesClipboard } from "../../../pages/pageTree/useCopyPastePages";
import { GQLFileCopyDataFragment, GQLFileCopyDataQuery, GQLFileCopyDataQueryVariables } from "./useCopyPasteFiles.generated";

interface FilesClipboard {
    files: GQLFileCopyDataFragment[];
}

type GetFromClipboardResponse = { canPaste: true; content: PagesClipboard } | { canPaste: false; error: React.ReactNode };

function isFilesClipboard(pagesClipboard: PagesClipboard): pagesClipboard is PagesClipboard {
    return (pagesClipboard as PagesClipboard).pages !== undefined;
}

const fileCopyDataFragment = gql`
    fragment FileCopyData on DamFile {
        id
        name
        contentHash
        title
        altText
        image {
            id
            cropArea {
                focalPoint
                width
                height
                x
                y
            }
        }
        license {
            type
            details
            author
            durationFrom
            durationTo
            expirationDate
        }
    }
`;

const fileCopyDataQuery = gql`
    query FileCopyData($id: ID!) {
        damFile(id: $id) {
            ...FileCopyData
        }
    }
    ${fileCopyDataFragment}
`;

export const useCopyPasteFiles = () => {
    const apolloClient = useApolloClient();

    const prepareForClipboard = React.useCallback(
        async (fileIds: string[]): Promise<FilesClipboard> => {
            const files: GQLFileCopyDataFragment[] = [];

            for (const id of fileIds) {
                const { data } = await apolloClient.query<GQLFileCopyDataQuery, GQLFileCopyDataQueryVariables>({
                    query: fileCopyDataQuery,
                    variables: { id: id },
                });

                files.push(data.damFile);
            }

            return { files: files };
        },
        [apolloClient],
    );

    const writeToClipboard = React.useCallback(async (files: FilesClipboard) => {
        return writeClipboardText(JSON.stringify(files));
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
            if (isFilesClipboard(parsedText)) {
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
                        defaultMessage="Content from clipboard aren't valid files"
                    />
                ),
            };
        }
    }, []);

    return { prepareForClipboard, writeToClipboard, getFromClipboard };
};
