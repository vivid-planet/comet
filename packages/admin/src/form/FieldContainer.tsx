import { FormControl, FormLabel, Grid } from "@material-ui/core";
import * as React from "react";

interface IProps {
    label?: string | React.ReactNode;
    required?: boolean;
}

export const FieldContainer: React.FunctionComponent<IProps> = (props) => (
    <FormControl fullWidth={true}>
        <Grid container alignItems="center">
            <Grid item xs={4}>
                {props.label && (
                    <FormLabel>
                        {props.label}
                        {props.required && "*"}
                    </FormLabel>
                )}
            </Grid>
            <Grid item xs={8}>
                {props.children}
            </Grid>
        </Grid>
    </FormControl>
);
