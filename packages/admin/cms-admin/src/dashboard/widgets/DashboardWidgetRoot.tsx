import { Grid, Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";

export type DashboardWidgetRootProps = React.PropsWithChildren<{
    header: React.ReactNode;
}>;

export const DashboardWidgetRoot = ({ header, children }: DashboardWidgetRootProps) => {
    return (
        <Grid item xs={12} lg={6}>
            <Paper square={false}>
                <HeaderWrapper>
                    <Typography variant="h5">{header}</Typography>
                </HeaderWrapper>
                {children}
            </Paper>
        </Grid>
    );
};

const HeaderWrapper = styled("div")`
    padding: 16px;
    background-color: ${({ theme }) => theme.palette.grey["A200"]};
    color: white;
`;
