import { Box, Button as MUIButton } from "@mui/material";
import { styled } from "@mui/material/styles";

export const HeaderDropdownContent = styled(Box)`
    width: 250px;
`;

export const HeaderButton = styled(MUIButton)`
    justify-content: flex-start;
`;

export const HeaderSeparator = styled(Box)`
    background-color: ${(props) => props.theme.palette.grey["100"]};
    height: 1px;
    width: 100%;
    margin-top: 20px;
    margin-bottom: 20px;
`;
