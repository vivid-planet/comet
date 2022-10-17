import { ToggleButton as MuiToggleButton } from "@mui/material";
import { styled } from "@mui/material/styles";

const ToggleButton = styled(MuiToggleButton)`
    width: 50px;
    height: 50px;
    border: none;
    border-radius: 0;
    border-bottom: 2px solid transparent;
    color: ${({ theme }) => theme.palette.common.white};

    &.Mui-selected {
        background-color: transparent;
        border-bottom: 2px solid ${({ theme }) => theme.palette.primary.main};
        color: ${({ theme }) => theme.palette.primary.main};
    }

    &:not(.MuiToggleButtonGroup-grouped) {
        border-left: 1px solid #2e3440;
    }
`;

export { ToggleButton };
