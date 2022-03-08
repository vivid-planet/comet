import { Grid, Paper, Typography } from "@material-ui/core";
import * as React from "react";
import styled from "styled-components";

type Props = {
    header: React.ReactNode;
};

const HeaderWrapper = styled.div`
    padding: 16px;
    background-color: ${({ theme }) => theme.palette.grey["A200"]};
    color: white;
`;

export const DashboardWidgetContainer: React.FC<React.PropsWithChildren<Props>> = (props: React.PropsWithChildren<Props>) => {
    const { header, children } = props;
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
