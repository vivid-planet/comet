import { Chip, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import { FormattedMessage } from "react-intl";

import { MarkedMatches } from "../../common/MarkedMatches";
import { PageTypeIcon } from "./PageTypeIcon";
import { PageTreePage } from "./usePageTree";
import { usePageTreeContext } from "./usePageTreeContext";

interface PageLabelProps {
    page: PageTreePage;
    disabled?: boolean;
    onClick?: (e: React.MouseEvent) => void;
}

const PageLabel: React.FunctionComponent<PageLabelProps> = ({ page, disabled, onClick }) => {
    const { documentTypes } = usePageTreeContext();
    const documentType = documentTypes[page.documentType];

    return (
        <Root onClick={onClick}>
            <PageTypeIcon page={page} disabled={disabled} />
            <LinkContent>
                <LinkText color={page.visibility === "Unpublished" || disabled ? "textSecondary" : "textPrimary"}>
                    <MarkedMatches text={page.name} matches={page.matches.filter((match) => match.where === "name")} />
                </LinkText>
                <LinkText color={page.visibility === "Unpublished" || disabled ? "textSecondary" : "textPrimary"}>
                    <MarkedMatches text={page.name} matches={page.matches.filter((match) => match.where === "path")} />
                </LinkText>
            </LinkContent>
            {page.visibility === "Archived" && (
                <ArchivedChip
                    component="span"
                    label={<FormattedMessage id="comet.pages.pages.archived" defaultMessage="Archived" />}
                    color="primary"
                    clickable={false}
                    size="small"
                />
            )}
            {documentType.InfoTag !== undefined && (
                <InfoPanel>
                    <documentType.InfoTag page={page} />
                </InfoPanel>
            )}
        </Root>
    );
};

export default PageLabel;

const InfoPanel = styled("div")`
    margin-left: 20px;
`;

const Root = styled("div")`
    display: flex;
    align-items: center;
`;

const LinkContent = styled("div")`
    margin-left: ${({ theme }) => theme.spacing(2)};
    display: flex;
    min-width: 0;
    flex-direction: column;
`;

const LinkText = styled(Typography)`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const ArchivedChip = styled(Chip)`
    margin-left: ${({ theme }) => theme.spacing(2)};
    cursor: inherit;
` as typeof Chip;
