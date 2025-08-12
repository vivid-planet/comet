import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

export const Root = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: start;
    background-color: ${({ theme }) => theme.palette.grey.A200};
    padding: ${({ theme }) => theme.spacing(2)};
`;
