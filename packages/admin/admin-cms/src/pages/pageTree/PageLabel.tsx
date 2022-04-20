import { Chip } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import { FormattedMessage } from "react-intl";

import { MarkedMatches } from "../../common/MarkedMatches";
import { PageTypeIcon } from "./PageTypeIcon";
import { PageTreePage } from "./usePageTree";

interface PageLabelProps {
    page: PageTreePage;
    onClick?: (e: React.MouseEvent) => void;
}

const PageLabel: React.FunctionComponent<PageLabelProps> = ({ page, onClick }) => {
    return (
        <Root onClick={onClick}>
            <PageTypeIcon page={page} />
            <LinkText>
                <MarkedMatches text={page.name} matches={page.matches} />
                {page.visibility === "Archived" && (
                    <>
                        {" "}
                        <Chip
                            label={<FormattedMessage id="comet.pages.pages.archived" defaultMessage="Archived" />}
                            color="primary"
                            clickable={false}
                            size="small"
                        />
                    </>
                )}
            </LinkText>
        </Root>
    );
};

export default PageLabel;

const Root = styled("div")`
    width: 100%;
    align-items: center;
    display: flex;
    color: inherit;
`;

const LinkText = styled("span")`
    margin-left: ${({ theme }) => theme.spacing(2)};
`;
