import * as React from "react";
import * as sc from "./FieldContainerLabelAbove.sc";

interface IProps {
    label?: string | React.ReactNode;
    required?: boolean;
}

export const FieldContainerLabelAbove: React.FunctionComponent<IProps> = props => (
    <sc.StyledFormControl fullWidth={true}>
        <div>
            <sc.StyledFormLabel>
                {props.label}
                {props.required && "*"}
            </sc.StyledFormLabel>
        </div>
        <div>{props.children}</div>
    </sc.StyledFormControl>
);
