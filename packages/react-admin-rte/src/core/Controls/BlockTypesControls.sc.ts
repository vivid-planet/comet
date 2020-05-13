import { Select as MuiSelect } from "@material-ui/core";
import { styled } from "@vivid-planet/react-admin-mui";

export const Select = styled(MuiSelect)`
    && {
        min-width: 180px;
        line-height: 24px;
        font-size: 14px;

        .MuiSelect-root {
            padding: 0;
        }
    }
`;
