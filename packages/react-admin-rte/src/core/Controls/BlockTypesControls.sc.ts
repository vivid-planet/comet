import { Select as MuiSelect } from "@material-ui/core";
import { styled } from "@vivid-planet/react-admin-mui";
import { IColors } from "../Rte";

interface ISelectProps {
    colors: IColors;
}

export const Select = styled(MuiSelect)<ISelectProps>`
    && {
        color: ${({ colors }) => colors.buttonIcon};
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
