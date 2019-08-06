import { Grid, Typography } from "@material-ui/core";
import * as React from "react";
import * as sc from "./FieldContainer.sc";

interface IProps {
    label?: string | React.ReactNode;
    required?: boolean;
}

export const FieldContainer: React.FunctionComponent<IProps> = props => (
    <sc.StyledFormControl fullWidth={true}>
        <Grid container>
            <Grid item xs={4}>
                {props.label && (
                    <sc.StyledFormLabel>
                        {props.label}
                        {props.required && "*"}
                    </sc.StyledFormLabel>
                )}
            </Grid>
            <Grid item xs={8}>
                {props.children}
            </Grid>
        </Grid>
    </sc.StyledFormControl>
);
