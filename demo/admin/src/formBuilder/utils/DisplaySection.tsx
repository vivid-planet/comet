import { Paper, Typography } from "@mui/material";
import { PropsWithChildren, ReactNode } from "react";
import { FormattedMessage } from "react-intl";

export const DisplaySection = ({ children }: { children: ReactNode }) => (
    <FieldSection title={<FormattedMessage id="formBuilder.fieldSection.display" defaultMessage="Display" />}>{children}</FieldSection>
);

type FieldSectionProps = PropsWithChildren<{
    title: ReactNode;
}>;

export const FieldSection = ({ children, title }: FieldSectionProps) => (
    <Paper variant="outlined" sx={{ padding: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
            {title}
        </Typography>
        {children}
    </Paper>
);
