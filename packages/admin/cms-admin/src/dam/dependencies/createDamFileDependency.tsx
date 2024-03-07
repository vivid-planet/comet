import { gql } from "@apollo/client";
import { messages } from "@comet/admin";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { DependencyInterface } from "../../dependencies/types";
import { GQLFileDependencyQuery, GQLFileDependencyQueryVariables } from "./createDamFileDependency.generated";

function createDamFileDependency(basePath = "/assets"): DependencyInterface {
    return {
        displayName: <FormattedMessage {...messages.file} />,
        resolveUrl: async ({ apolloClient, id }) => {
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

            return `${basePath}/${folderIds.map((id) => `${id}/folder`).join("/")}${folderIds.length > 0 ? "/" : ""}${data.damFile.id}/edit`;
        },
    };
}

export { createDamFileDependency };
