import { styled } from "@mui/material/styles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { Tag } from "./Tag";

const StyledTag = styled(Tag)`
    background-color: ${({ theme }) => theme.palette.primary.main};
`;

export const ArchivedTag: React.VoidFunctionComponent = () => {
    return (
        <StyledTag>
            <FormattedMessage id={"comet.pages.dam.tag.archived"} defaultMessage={"Archived"} />
        </StyledTag>
    );
};
