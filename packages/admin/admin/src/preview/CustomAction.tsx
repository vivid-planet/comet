import { IconButton, styled } from "@mui/material";

export const CustomAction: React.FC = styled(IconButton)`
    width: 50px;
    height: 50px;
    border-radius: 0;
    color: ${({ theme }) => theme.palette.common.white};
    border-left: 1px solid #2e3440;
`;
