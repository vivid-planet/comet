import * as React from "react";
import { StyledFormControl, StyledFormLabel } from "./FieldContainerLabelAbove.sc";

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
