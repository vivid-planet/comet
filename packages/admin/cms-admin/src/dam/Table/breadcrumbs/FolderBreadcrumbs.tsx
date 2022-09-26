import { BreadcrumbItem } from "@comet/admin";
import { ChevronRight } from "@comet/admin-icons";
import { Breadcrumbs, Link } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { useDrop } from "react-dnd";
import { FormattedMessage } from "react-intl";
import { Link as RouterLink } from "react-router-dom";

import { useOptimisticQuery } from "../../../common/useOptimisticQuery";
import { GQLDamFolderBreadcrumbFragment, GQLDamFolderBreadcrumbQuery, GQLDamFolderBreadcrumbQueryVariables } from "../../../graphql.generated";
import { useDamDnD } from "../dnd/useDamDnD";
import { DamDragObject } from "../FolderTableRow";
import { damFolderBreadcrumbFragment, damFolderBreadcrumbQuery } from "./FolderBreadcrumbs.gql";

interface DamBreadcrumbItem {
    id: string | null;
    url: string;
}

type FolderBreadcrumbProps = DamBreadcrumbItem;

interface FolderBreadcrumbsProps {
    breadcrumbs: BreadcrumbItem[];
    folderIds: Array<string | null>;
    loading?: boolean;
}

const FolderBreadcrumbWrapper = styled("div", { shouldForwardProp: (prop) => prop !== "$isHovered" })<{ $isHovered: boolean }>`
    font-weight: 500;
    padding: 6px;
    outline: ${({ theme, $isHovered }) => ($isHovered ? `solid 1px ${theme.palette.primary.main}` : "none")};
    background-color: ${({ $isHovered }) => ($isHovered ? "rgba(41,182,246,0.1)" : "#fff")};

    & .MuiLink-root {
        color: ${({ theme }) => theme.palette.grey[900]};
    }
`;

const FolderBreadcrumb = ({ id, url }: FolderBreadcrumbProps): React.ReactElement => {
    const { moveItem } = useDamDnD();

    const { data } = useOptimisticQuery<GQLDamFolderBreadcrumbQuery, GQLDamFolderBreadcrumbQueryVariables>(damFolderBreadcrumbQuery, {
        variables: {
            // Cannot be null because of skip
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            id: id!,
        },
        skip: id === null,
        optimisticResponse: (cache) => {
            const fragment = cache.readFragment<GQLDamFolderBreadcrumbFragment>({
                id: cache.identify({ __typename: "DamFolder", id: id }),
                fragment: damFolderBreadcrumbFragment,
            });

            return fragment ? { damFolder: fragment } : undefined;
        },
    });

    const [{ isOver }, dropTarget] = useDrop({
        accept: ["folder", "asset"],
        drop: (dragObject: DamDragObject) => {
            moveItem({ dropTargetItem: { id }, dragItem: dragObject.item });
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    });

    return (
        <FolderBreadcrumbWrapper ref={dropTarget} $isHovered={isOver}>
            <Link color="inherit" underline="none" key={id} to={url} component={RouterLink}>
                {id === null ? <FormattedMessage id="comet.pages.dam.assetManager" defaultMessage="Asset Manager" /> : data?.damFolder.name}
            </Link>
        </FolderBreadcrumbWrapper>
    );
};

const FolderBreadcrumbs = ({ breadcrumbs: stackBreadcrumbs, folderIds, loading }: FolderBreadcrumbsProps): React.ReactElement | null => {
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
            const url = `${prevUrl}/${folderId}/folder`;

            damBreadcrumbs.push({
                id: folderId,
                url: url,
            });
        }
    }

    return (
        <Breadcrumbs separator={<ChevronRight fontSize="small" />}>
            {!loading &&
                damBreadcrumbs?.map((damBreadcrumb) => {
                    return <FolderBreadcrumb key={damBreadcrumb.id} id={damBreadcrumb.id} url={damBreadcrumb.url} />;
                })}
        </Breadcrumbs>
    );
};

export default FolderBreadcrumbs;
