import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const ScopeIndicatorLabelBold = styled(Typography)`
    && {
        font-weight: 400;
        padding: 0 8px 0 4px;
        text-transform: uppercase;
    }
`;

export const ScopeIndicatorContent = styled("div")`
    display: flex;
    align-items: center;
`;

export const ScopeIndicatorLabel = styled(Typography)`
    && {
        padding-left: 8px;
        text-transform: uppercase;
    }
`;
