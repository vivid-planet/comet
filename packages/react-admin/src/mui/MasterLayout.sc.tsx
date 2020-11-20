import { AppBar } from "@material-ui/core";

import { styled } from "./styled-components";

export const Header = styled(AppBar)`
    && {
        z-index: ${({ theme }) => theme.zIndex.drawer + 1};
    }
`;
