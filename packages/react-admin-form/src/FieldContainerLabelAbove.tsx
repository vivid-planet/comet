import { FormControl, FormLabel } from "@material-ui/core";
import * as React from "react";

interface IProps {
    label?: string | React.ReactNode;
    required?: boolean;
}

export const FieldContainerLabelAbove: React.FunctionComponent<IProps> = ({ label, required, children }) => (
    <FormControl fullWidth={true}>
        {label && (
            <div>
                <FormLabel>
                    {label}
                    {required && "*"}
                </FormLabel>
            </div>
        )}
        {children}
    </FormControl>
);
