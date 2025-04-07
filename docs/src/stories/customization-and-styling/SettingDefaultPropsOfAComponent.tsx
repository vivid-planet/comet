import { ContentOverflow, MuiThemeProvider } from "@comet/admin";
import { Preview } from "@comet/admin-icons";
import { createCometTheme } from "@comet/admin-theme";
import { Typography } from "@mui/material";
import React from "react";

function Story() {
    const theme = createCometTheme({
        components: {
            CometAdminContentOverflow: {
                defaultProps: {
                    iconMapping: {
                        openDialog: <Preview fontSize="large" />,
                    },
                },
            },
        },
    });

    return (
        <MuiThemeProvider theme={theme}>
            <ContentOverflow>
                <Typography variant="h2">Title</Typography>
                <Typography>
                    Lorem ipsum etiam porta sem malesuada magna mollis euismod. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Nullam
                    quis risus eget urna mollis ornare vel eu leo.
                </Typography>
            </ContentOverflow>
        </MuiThemeProvider>
    );
}

export default Story;
