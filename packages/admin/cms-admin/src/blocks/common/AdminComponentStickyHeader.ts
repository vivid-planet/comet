import { styled } from "@mui/material/styles";

export const AdminComponentStickyHeader = styled("div")`
    position: sticky;
    top: 70px;
    background-color: ${({ theme }) => theme.palette.background.paper};
    border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
    z-index: 15;
`;
