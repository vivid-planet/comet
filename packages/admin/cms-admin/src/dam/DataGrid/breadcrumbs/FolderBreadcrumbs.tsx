import { type BreadcrumbItem } from "@comet/admin";
import { ChevronRight, LevelUp } from "@comet/admin-icons";
import { Breadcrumbs, IconButton, Link, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FormattedMessage } from "react-intl";
import { Link as RouterLink } from "react-router-dom";

import { useOptimisticQuery } from "../../../common/useOptimisticQuery";
import { damFolderBreadcrumbFragment, damFolderBreadcrumbQuery } from "./FolderBreadcrumbs.gql";
import {
    type GQLDamFolderBreadcrumbFragment,
    type GQLDamFolderBreadcrumbQuery,
    type GQLDamFolderBreadcrumbQueryVariables,
} from "./FolderBreadcrumbs.gql.generated";

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

interface BackButtonProps {
    damBreadcrumbs: DamBreadcrumbItem[];
}

const FolderBreadcrumbsWrapper = styled("div")`
    display: flex;
    align-items: center;
`;

const FolderBreadcrumbWrapper = styled("div")`
    padding: 6px;

    & .MuiLink-root {
        color: ${({ theme }) => theme.palette.grey[900]};
    }
`;

const BackButtonWrapper = styled("div")`
    display: flex;
    align-items: center;
`;

const BackIconButton = styled(IconButton)`
    padding: ${({ theme }) => theme.spacing(2)};
    margin-right: ${({ theme }) => theme.spacing(1)};
`;

const BackButtonSeparator = styled("div")`
    height: 30px;
    width: 1px;
    background-color: ${({ theme }) => theme.palette.divider};
    margin-right: 12px;
`;

const BackButton = ({ damBreadcrumbs }: BackButtonProps) => {
    return (
        <BackButtonWrapper>
            <Link
                color="inherit"
                underline="none"
                to={damBreadcrumbs.length >= 2 ? damBreadcrumbs[damBreadcrumbs.length - 2].url : "#"}
                component={RouterLink}
            >
                <BackIconButton disabled={damBreadcrumbs.length < 2}>
                    <LevelUp />
                </BackIconButton>
            </Link>
            <BackButtonSeparator />
        </BackButtonWrapper>
    );
};

const FolderBreadcrumb = ({ id, url }: FolderBreadcrumbProps) => {
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

            return fragment === null || Object.keys(fragment).length === 0 ? undefined : { damFolder: fragment };
        },
    });

    return (
        <FolderBreadcrumbWrapper>
            <Link color="inherit" underline="none" key={id} to={url} component={RouterLink}>
                <Typography component="span" variant="subtitle1">
                    {id === null ? <FormattedMessage id="comet.pages.dam.assetManager" defaultMessage="Asset Manager" /> : data?.damFolder.name}
                </Typography>
            </Link>
        </FolderBreadcrumbWrapper>
    );
};

const FolderBreadcrumbs = ({ breadcrumbs: stackBreadcrumbs, folderIds, loading }: FolderBreadcrumbsProps) => {
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
            const url = `${prevUrl.endsWith("/") ? prevUrl.slice(0, -1) : prevUrl}/${folderId}/folder`;

            damBreadcrumbs.push({
                id: folderId,
                url: url,
            });
        }
    }

    return (
        <FolderBreadcrumbsWrapper>
            <BackButton damBreadcrumbs={damBreadcrumbs} />
            <Breadcrumbs separator={<ChevronRight fontSize="small" />}>
                {!loading &&
                    damBreadcrumbs?.map((damBreadcrumb) => {
                        return <FolderBreadcrumb key={damBreadcrumb.id} id={damBreadcrumb.id} url={damBreadcrumb.url} />;
                    })}
            </Breadcrumbs>
        </FolderBreadcrumbsWrapper>
    );
};

export default FolderBreadcrumbs;
