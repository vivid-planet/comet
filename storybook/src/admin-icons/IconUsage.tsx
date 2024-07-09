import { Cookie, Error, ThreeDotSaving } from "@comet/admin-icons";
import { Card, CardContent, Grid, Typography } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

function Story() {
    return (
        <Grid container spacing={4}>
            <Grid item xs={12}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h3">Simple Icon rendering</Typography>
                        <Typography>
                            This is and Error <Error /> icon.
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h3">Icon Sizes</Typography>
                        <Typography>
                            Small: <Cookie fontSize="small" />
                        </Typography>
                        <Typography>
                            Default Size: <Cookie fontSize="medium" />
                        </Typography>

                        <Typography>
                            Large: <Cookie fontSize="large" />
                        </Typography>
                        <Typography>
                            Custom Size (100) <Cookie sx={{ fontSize: 100 }} /> icon.
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h3">Colors</Typography>
                        <Typography>
                            No Color: <ThreeDotSaving />
                        </Typography>

                        <Typography>
                            Primary: <ThreeDotSaving color="primary" />
                        </Typography>

                        <Typography>
                            Secondary: <ThreeDotSaving color="secondary" />
                        </Typography>
                        <Typography>
                            Error: <ThreeDotSaving color="error" />
                        </Typography>

                        <Typography>
                            Disabled: <ThreeDotSaving color="disabled" />
                        </Typography>
                        <Typography>
                            Action: <ThreeDotSaving color="action" />
                        </Typography>

                        <Typography>
                            Custom (#ff00ff): <ThreeDotSaving htmlColor="#ff00ff" />
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}

storiesOf("@comet/admin-icons", module).add("Icon Usage", () => <Story />);
