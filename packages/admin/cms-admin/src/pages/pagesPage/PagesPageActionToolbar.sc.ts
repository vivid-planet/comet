import { FormControlLabel, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";

export const Root = styled(Grid)`
    min-height: 51px;
    display: flex;
    align-items: center;
`;

export const SelectAllLabel = styled(FormControlLabel)`
    padding: 15px 10px 15px 7px;
    display: flex;
    align-items: center;
`;

export const CenterContainer = styled(Grid)`
    display: flex;
    align-items: center;
`;

export const Separator = styled("div")`
    display: inline-flex;
    width: 1px;
    height: 26px;
    background-color: ${(props) => props.theme.palette.grey["200"]};
    margin-left: 20px;
    margin-right: 20px;
`;
