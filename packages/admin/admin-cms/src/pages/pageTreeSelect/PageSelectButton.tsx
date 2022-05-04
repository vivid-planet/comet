import { ButtonBase } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";

import { MarkedMatches } from "../../common/MarkedMatches";
import { PageTypeIcon } from "../pageTree/PageTypeIcon";
import { PageTreePage } from "../pageTree/usePageTree";

interface PageLabelProps {
    page: PageTreePage;
    onClick?: (e: React.MouseEvent) => void;
}

const PageSelectButton: React.FunctionComponent<PageLabelProps> = ({ page, onClick }) => {
    return (
        <Button onClick={onClick} disabled={page.documentType === "Link"}>
            <ButtonContent>
                <PageTypeIcon page={page} />
                <LinkText>
                    <MarkedMatches text={page.name} matches={page.matches} />
                </LinkText>
            </ButtonContent>
        </Button>
    );
};

export default PageSelectButton;

const Button = styled(ButtonBase)`
    &:disabled {
        color: ${({ theme }) => theme.palette.text.disabled};
    }
    width: 100%;
`;

const ButtonContent = styled("div")`
    width: 100%;
    align-items: flex-start;
    display: flex;
`;

const LinkText = styled("span")`
    margin-left: ${({ theme }) => theme.spacing(2)};
`;
