import { Paper, Typography } from "@mui/material";
import { PropsWithChildren, ReactNode } from "react";
import { FormattedMessage } from "react-intl";

export const DisplayFieldGroup = ({ children }: { children: ReactNode }) => (
    <FieldGroup title={<FormattedMessage id="formBuilder.common.display" defaultMessage="Display" />}>{children}</FieldGroup>
);

export const PropsAndValidationFieldGroup = ({ children }: { children: ReactNode }) => (
    <FieldGroup title={<FormattedMessage id="formBuilder.common.propsAndValidation" defaultMessage="Props and Validation" />}>{children}</FieldGroup>
);

type FieldGroupProps = PropsWithChildren<{
    title: ReactNode;
}>;

export const FieldGroup = ({ children, title }: FieldGroupProps) => (
    <Paper variant="outlined" sx={{ padding: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
            {title}
        </Typography>
        {children}
    </Paper>
);
