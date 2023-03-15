import { messages } from "@comet/admin";
import gql from "graphql-tag";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { Dependency, DependencyComponentProps } from "../dependencies/Dependency";
import { DependencyInterface } from "../documents/types";
import { GQLFileDependencyQuery, GQLFileDependencyQueryVariables } from "./FileDependency.generated";

const File: DependencyInterface<GQLFileDependencyQuery, GQLFileDependencyQueryVariables> = {
    displayName: <FormattedMessage {...messages.file} />,
    dependencyQuery: gql`
        query FileDependency($id: ID!) {
            damFile(id: $id) {
                id
                name
                damPath
                folder {
                    id
                    parents {
                        id
                    }
                }
            }
        }
    `,
    getName: (data) => {
        return data.damFile.name;
    },
    getSecondaryInformation: (data) => {
        return data.damFile.damPath;
    },
    getUrl: (data, { contentScopeUrl }) => {
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

export const FileDependency = ({ id, dependencyData, contentScopeUrl }: DependencyComponentProps) => {
    return <Dependency id={id} DependencyObject={File} graphqlVariables={{ id }} dependencyData={dependencyData} contentScopeUrl={contentScopeUrl} />;
};
