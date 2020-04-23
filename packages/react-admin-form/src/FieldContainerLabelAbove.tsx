import { FormControl, FormLabel } from "@material-ui/core";
import * as React from "react";

interface IProps {
    label?: string | React.ReactNode;
    required?: boolean;
}

export const FieldContainerLabelAbove: React.FunctionComponent<IProps> = props => (
    <FormControl fullWidth={true}>
        <div>
            <FormLabel>
                {props.label}
                {props.required && "*"}
            </FormLabel>
        </div>
        <div>{props.children}</div>
    </FormControl>
);
