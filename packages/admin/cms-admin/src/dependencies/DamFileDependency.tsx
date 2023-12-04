import { gql } from "@apollo/client";
import { messages } from "@comet/admin";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { GQLFileDependencyQuery, GQLFileDependencyQueryVariables } from "./DamFileDependency.generated";
import { DependencyInterface } from "./types";

export const DamFileDependency: DependencyInterface = {
    displayName: <FormattedMessage {...messages.file} />,
    resolveUrl: async ({ contentScopeUrl, apolloClient, id }) => {
        const { data, error } = await apolloClient.query<GQLFileDependencyQuery, GQLFileDependencyQueryVariables>({
            query: gql`
                query FileDependency($id: ID!) {
                    damFile(id: $id) {
                        id
                        folder {
                            id
                            parents {
                                id
                            }
                        }
                    }
                }
            `,
            variables: {
                id,
            },
        });

        if (error) {
            throw new Error(`DamFile.getUrl: Could not find a DamFile with id ${id}`);
        }

        const folderIds: string[] = [];
        if (data.damFile.folder) {
            data.damFile.folder.parents.forEach((parent) => {
                folderIds.push(parent.id);
            });
            folderIds.push(data.damFile.folder.id);
        }

        return `${contentScopeUrl}/assets/${folderIds.map((id) => `${id}/folder`).join("/")}${folderIds.length > 0 ? "/" : ""}${
            data.damFile.id
        }/edit`;
    },
};
