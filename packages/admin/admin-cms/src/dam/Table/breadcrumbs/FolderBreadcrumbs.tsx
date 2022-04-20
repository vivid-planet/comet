import { useMutation, useQuery } from "@apollo/client";
import { BreadcrumbItem, LocalErrorScopeApolloContext } from "@comet/admin";
import { ChevronRight } from "@comet/admin-icons";
import { Breadcrumbs, Link } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as path from "path";
import * as React from "react";
import { useDrop } from "react-dnd";
import { FormattedMessage } from "react-intl";
import { Link as RouterLink } from "react-router-dom";

import {
    GQLDamFolderBreadcrumbQuery,
    GQLDamFolderBreadcrumbQueryVariables,
    GQLUpdateDamFileMutation,
    GQLUpdateDamFileMutationVariables,
    GQLUpdateDamFolderMutation,
    GQLUpdateDamFolderMutationVariables,
    namedOperations,
} from "../../../graphql.generated";
import { updateDamFileMutation, updateDamFolderMutation } from "../FolderTable.gql";
import { DamDragObject, isFile, isFolder } from "../FolderTableRow";
import { damFolderBreadcrumbQuery } from "./FolderBreadcrumbs.gql";

interface DamBreadcrumbItem {
    id: string | null;
    url: string;
}

interface FolderBreadcrumbs {
    breadcrumbs: BreadcrumbItem[];
    folderIds: Array<string | null>;
}

interface FolderBreadcrumb {
    id: string | null;
    url: string;
}

const FolderBreadcrumbWrapper = styled("div")<{ $isHovered: boolean }>`
    font-weight: 500;
    padding: 6px;
    outline: ${({ theme, $isHovered }) => ($isHovered ? `solid 1px ${theme.palette.primary.main}` : "none")};
    background-color: ${({ $isHovered }) => ($isHovered ? "rgba(41,182,246,0.1)" : "#fff")};

    & .MuiLink-root {
        color: ${({ theme }) => theme.palette.grey[900]};
    }
`;

const FolderBreadcrumb = ({ id, url }: FolderBreadcrumb): React.ReactElement => {
    const [isHovered, setIsHovered] = React.useState<boolean>(false);

    const [updateFile] = useMutation<GQLUpdateDamFileMutation, GQLUpdateDamFileMutationVariables>(updateDamFileMutation);
    const [updateFolder] = useMutation<GQLUpdateDamFolderMutation, GQLUpdateDamFolderMutationVariables>(updateDamFolderMutation);

    const { data } = useQuery<GQLDamFolderBreadcrumbQuery, GQLDamFolderBreadcrumbQueryVariables>(damFolderBreadcrumbQuery, {
        variables: {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            id: id!,
        },
        skip: id === null,
    });

    const [, dropTarget] = useDrop({
        accept: ["folder", "asset"],
        drop: (dragObject: DamDragObject) => {
            if (isFile(dragObject.item)) {
                updateFile({
                    variables: {
                        id: dragObject.item.id,
                        input: {
                            folderId: id,
                        },
                    },
                    refetchQueries: [namedOperations.Query.DamFilesList, namedOperations.Query.DamFoldersList],
                    context: LocalErrorScopeApolloContext,
                });
            } else if (isFolder(dragObject.item)) {
                updateFolder({
                    variables: {
                        id: dragObject.item.id,
                        input: {
                            parentId: id,
                        },
                    },
                    refetchQueries: [namedOperations.Query.DamFilesList, namedOperations.Query.DamFoldersList],
                    context: LocalErrorScopeApolloContext,
                });
            }

            setIsHovered(false);
        },
        hover: () => {
            setIsHovered(true);
        },
    });

    return (
        <FolderBreadcrumbWrapper
            ref={dropTarget}
            onDragLeave={() => {
                setIsHovered(false);
            }}
            $isHovered={isHovered}
        >
            <Link color="inherit" underline="none" key={id} to={url} component={RouterLink}>
                {data?.damFolder.name ?? <FormattedMessage id="comet.pages.dam.assetManager" defaultMessage={"Asset Manager"} />}
            </Link>
        </FolderBreadcrumbWrapper>
    );
};

const FolderBreadcrumbs = ({ breadcrumbs: stackBreadcrumbs, folderIds }: FolderBreadcrumbs): React.ReactElement | null => {
    // before stackBreadcrumbs are generated, they have no items
    if (stackBreadcrumbs.length === 0) {
        return null;
    }
    const rootUrl = stackBreadcrumbs[0].url;

    // when searching it's possible to skip pages in the folder stack, e.g.
    // given hierarchy: root_folder -> first_folder -> second_folder
    // when searching for "second_folder" and navigating directly to this folder, "first_folder" is never visited.
    // Therefore, "first_folder" doesn't show up in the breadcrumbs.
    // To prevent missing folders, the breadcrumbs are recreated from the actual folder hierarchy.
    const damBreadcrumbs: DamBreadcrumbItem[] = [];
    for (const folderId of folderIds) {
        if (folderId === null) {
            damBreadcrumbs.push({
                id: folderId,
                url: rootUrl,
            });
        } else {
            const prevUrl = damBreadcrumbs[damBreadcrumbs.length - 1].url;
            const url = path.join(prevUrl, folderId, "folder");

            damBreadcrumbs.push({
                id: folderId,
                url: url,
            });
        }
    }

    return (
        <Breadcrumbs separator={<ChevronRight fontSize="small" />}>
            {damBreadcrumbs?.map((damBreadcrumb) => {
                return <FolderBreadcrumb key={damBreadcrumb.id} id={damBreadcrumb.id} url={damBreadcrumb.url} />;
            })}
        </Breadcrumbs>
    );
};

export default FolderBreadcrumbs;
