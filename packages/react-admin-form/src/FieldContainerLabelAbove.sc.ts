import { FormControl, FormLabel } from "@material-ui/core";
import { ColorPartial } from "@material-ui/core/styles/createPalette";
import { styledComponents as styled } from "@vivid-planet/react-admin-mui";

export const StyledFormControl = styled(FormControl)`
    && {
        padding-bottom: 16px;
    }
`;

export const StyledFormLabel = styled(FormLabel)`
    && {
        display: block;
        margin-bottom: 4px;
        font-size: 13px;
        line-height: 20px;
        font-weight: bold;
        color: ${props => (props.theme.palette.secondary as ColorPartial)["700"]};
    }
`;
