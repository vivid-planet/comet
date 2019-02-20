import { FormControl, FormLabel, Grid } from "@material-ui/core";
import styled from "@vivid-planet/react-admin-mui/styled-components";
import * as React from "react";

const StyledFormControl = styled(FormControl)`
    && {
        padding-bottom: 16px;
    }
`;

const StyledFormLabel = styled(FormLabel)`
    && {
        margin: 8px 0;
        display: block;
    }
`;

interface IProps {
    label?: string | React.ReactNode;
    required?: boolean;
}
const FieldContainerLabelAbove: React.FunctionComponent<IProps> = props => (
    <StyledFormControl fullWidth={true}>
        <div>
            <StyledFormLabel>
                {props.label}
                {props.required && "*"}
            </StyledFormLabel>
        </div>
        <div>{props.children}</div>
    </StyledFormControl>
);

export default FieldContainerLabelAbove;
