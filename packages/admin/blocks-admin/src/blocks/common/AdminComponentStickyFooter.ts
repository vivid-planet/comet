import { styled } from "@mui/material/styles";

export const AdminComponentStickyFooter = styled("div")`
    && {
        position: sticky;
        bottom: 0;
        background-color: ${({ theme }) => theme.palette.background.paper};
        border-top: 1px solid ${({ theme }) => theme.palette.divider};
        margin-top: -1px;
        z-index: 15;
    }
`;
