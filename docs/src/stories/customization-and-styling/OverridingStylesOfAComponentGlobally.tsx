import { ContentOverflow, createCometTheme, MuiThemeProvider } from "@comet/admin";
import { Typography } from "@mui/material";

function Story() {
    const theme = createCometTheme({
        components: {
            CometAdminContentOverflow: {
                styleOverrides: {
                    root: {
                        backgroundColor: "lime",
                    },
                    openDialogIcon: {
                        fontSize: 40,
                        color: "fuchsia",
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
