import { Button, Popover } from "@mui/material";
import { styled } from "@mui/material/styles";

interface WrapperProps {
    $active: boolean;
}

export const Wrapper = styled("div", { shouldForwardProp: (prop) => prop !== "$active" })<WrapperProps>`
    width: fit-content;
    position: relative;
    border: 1px solid ${({ theme, $active }) => ($active ? theme.palette.grey[400] : theme.palette.grey[100])};
`;

export const SortByButton = styled(Button)`
    position: relative;
    align-items: center;
    padding: 10px 15px;
    cursor: pointer;
    display: flex;
    margin: 0;

    & [class*="muisvgicon-root"] {
        font-size: 12px;
    }

    &:hover {
        background: initial;
    }
`;

export const LabelWrapper = styled("div")`
    box-sizing: border-box;
    margin-right: 6px;
    & [class*="MuiTypography-body1"] {
        font-weight: ${({ theme }) => theme.typography.fontWeightRegular};
    }
`;

export const StyledPopover = styled(Popover)`
    margin-left: -1px; //due to border of popover, but now overrideable with styling if needed
    margin-top: 2px; //due to boxShadow of popover to not overlap border of clickable fieldBar
`;

export const InnerListItem = styled("div")`
    min-width: 150px;
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;
