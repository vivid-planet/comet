import { FormControl, FormLabel, Grid } from "@material-ui/core";
import { styled } from "@vivid-planet/react-admin-mui";
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

export const FieldContainer: React.FunctionComponent<IProps> = props => (
    <StyledFormControl fullWidth={true}>
        <Grid container>
            <Grid item xs={4}>
                {props.label && (
                    <StyledFormLabel>
                        {props.label}
                        {props.required && "*"}
                    </StyledFormLabel>
                )}
            </Grid>
            <Grid item xs={8}>
                {props.children}
            </Grid>
        </Grid>
    </StyledFormControl>
);
