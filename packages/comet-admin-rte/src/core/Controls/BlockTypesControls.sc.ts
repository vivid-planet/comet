import { Select as MuiSelect } from "@material-ui/core";
import styled from "styled-components";

export const Select = styled(MuiSelect)`
    && {
        color: ${({ theme }) => theme.rte.colors.buttonIcon};
        min-width: 180px;
        line-height: 24px;
        font-size: 14px;

        .MuiSelect-root {
            padding: 0;
        }

        .MuiSvgIcon-root {
            color: inherit;
        }
    }
`;
