import { type BreadcrumbItem } from "@comet/admin";
import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

import { useOptimisticQuery } from "../../common/useOptimisticQuery";
import FolderBreadcrumbs from "./breadcrumbs/FolderBreadcrumbs";
import { damFolderMPathFragment, damFolderMPathQuery } from "./FolderHead.gql";
import { type GQLDamFolderMPathFragment, type GQLDamFolderMPathQuery, type GQLDamFolderMPathQueryVariables } from "./FolderHead.gql.generated";

export { GQLDamFolderMPathFragment, GQLDamFolderMPathQuery, GQLDamFolderMPathQueryVariables } from "./FolderHead.gql.generated";

interface TableHeadProps {
    isSearching: boolean;
    numberItems?: number;
    breadcrumbs?: BreadcrumbItem[];
    folderId?: string;
}

const TableHeadWrapper = styled("div")`
    min-height: 51px;
    padding: 15px 12px;
    background-color: white;
    border-top: 1px solid ${({ theme }) => theme.palette.grey[100]};
    border-bottom: 1px solid ${({ theme }) => theme.palette.grey[100]};
`;

const BoldTypography = styled(Typography)`
    font-weight: 500;
`;

export const FolderHead = ({ isSearching, numberItems, breadcrumbs, folderId }: TableHeadProps) => {
    let content: ReactNode = null;

    const { data, loading } = useOptimisticQuery<GQLDamFolderMPathQuery, GQLDamFolderMPathQueryVariables>(damFolderMPathQuery, {
        variables: {
            // Cannot be null because of skip
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            id: folderId!,
        },
        skip: !folderId,
        optimisticResponse: (cache) => {
            const fragment = cache.readFragment<GQLDamFolderMPathFragment>({
                id: cache.identify({ __typename: "DamFolder", id: folderId ?? null }),
                fragment: damFolderMPathFragment,
            });

            return fragment === null || Object.keys(fragment).length === 0 ? undefined : { damFolder: fragment };
        },
    });

    if (isSearching) {
        content = (
            <BoldTypography variant="body1">
                <FormattedMessage
                    id="comet.pages.dam.foundNumberItems"
                    defaultMessage="Found {number} {number, plural, one {item} other {items}}"
                    values={{
                        number: numberItems,
                    }}
                />
            </BoldTypography>
        );
    } else if (breadcrumbs) {
        const folderIds: Array<string | null> = [null];
        if (data?.damFolder) {
            folderIds.push(...data.damFolder.mpath);
            folderIds.push(data?.damFolder.id);
        }

        content = <FolderBreadcrumbs breadcrumbs={breadcrumbs} folderIds={folderIds} loading={loading && !data?.damFolder} />;
    }

    return <TableHeadWrapper>{content}</TableHeadWrapper>;
};
