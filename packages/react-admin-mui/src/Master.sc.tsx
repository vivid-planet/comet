import { AppBar } from "@material-ui/core";
import { styled } from "./styled-components";

export const Header = styled(AppBar)`
    && {
        padding-top: 6px;
        padding-bottom: 6px;
        z-index: ${({ theme }) => theme.zIndex.drawer + 1};
    }
`;
