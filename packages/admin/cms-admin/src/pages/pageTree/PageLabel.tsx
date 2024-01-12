import { StackLink } from "@comet/admin";
import { Chip, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { ReactNode } from "react";
import { FormattedMessage } from "react-intl";

import { MarkedMatches } from "../../common/MarkedMatches";
import { PageTypeIcon } from "./PageTypeIcon";
import { PageTreePage } from "./usePageTree";
import { usePageTreeContext } from "./usePageTreeContext";

interface PageLabelProps {
    page: PageTreePage;
    disabled?: boolean;
    isEditable?: boolean;
    onClick?: (e: React.MouseEvent) => void;
}

const PageLabel: React.FunctionComponent<PageLabelProps> = ({ page, disabled, isEditable = true, onClick }) => {
    const { documentTypes } = usePageTreeContext();
    const documentType = documentTypes[page.documentType];
    const pathMatches = page.matches.filter((match) => match.where === "path");

    const Root = React.useMemo(() => {
        if (!isEditable) {
            return ({ children }: { children?: ReactNode | undefined }) => <RootDiv>{children}</RootDiv>;
        } else if (onClick) {
            return ({ children }: { children?: ReactNode | undefined }) => <RootButton onClick={onClick}>{children}</RootButton>;
        } else {
            return ({ children }: { children?: ReactNode | undefined }) => (
                <RootStackLink pageName="edit" payload={page.id}>
                    {children}
                </RootStackLink>
            );
        }
    }, [isEditable, onClick, page.id]);

    return (
        <Root>
            <PageTypeIcon page={page} disabled={disabled} />
            <LinkContent>
                <LinkText color={page.visibility === "Unpublished" || disabled ? "textSecondary" : "textPrimary"}>
                    <MarkedMatches text={page.name} matches={page.matches.filter((match) => match.where === "name")} />
                </LinkText>
                {pathMatches.length > 0 && (
                    <LinkText color={page.visibility === "Unpublished" || disabled ? "textSecondary" : "textPrimary"}>
                        <MarkedMatches text={page.path} matches={pathMatches} />
                    </LinkText>
                )}
                {page.visibility === "Archived" && (
                    <ArchivedChip
                        component="span"
                        label={<FormattedMessage id="comet.pages.pages.archived" defaultMessage="Archived" />}
                        color="primary"
                        clickable={false}
                        size="small"
                    />
                )}
            </LinkContent>
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

const RootDiv = styled("div")`
    display: flex;
    align-items: center;
`;

const RootButton = styled("button")`
    display: flex;
    align-items: center;
    background: none;
    border: none;
`;

const RootStackLink = styled(StackLink)`
    display: flex;
    align-items: center;
    text-decoration: none;
    color: inherit;
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
