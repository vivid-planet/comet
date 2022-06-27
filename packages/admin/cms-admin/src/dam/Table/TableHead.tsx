import { BreadcrumbItem } from "@comet/admin";
import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { GQLDamFolderQuery } from "../../graphql.generated";
import FolderBreadcrumbs from "./breadcrumbs/FolderBreadcrumbs";

interface TableHeadProps {
    isSearching: boolean;
    numberItems?: number;
    breadcrumbs?: BreadcrumbItem[];
    folderData?: GQLDamFolderQuery;
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

export const TableHead = ({ isSearching, numberItems, breadcrumbs, folderData }: TableHeadProps): React.ReactElement => {
    let content: React.ReactNode = null;

    if (isSearching) {
        content = (
            <BoldTypography variant="body1">
                <FormattedMessage
                    id="comet.pages.dam.foundNumberItems"
                    defaultMessage="Found {number} items"
                    values={{
                        number: numberItems,
                    }}
                />
            </BoldTypography>
        );
    } else if (breadcrumbs) {
        const folderIds: Array<string | null> = [null];
        if (folderData) {
            folderIds.push(...folderData.damFolder.mpath);
            folderIds.push(folderData.damFolder.id);
        }

        content = <FolderBreadcrumbs breadcrumbs={breadcrumbs} folderIds={folderIds} />;
    }

    return <TableHeadWrapper>{content}</TableHeadWrapper>;
};
