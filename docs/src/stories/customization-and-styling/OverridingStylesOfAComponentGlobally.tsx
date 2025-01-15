import { ContentOverflow, MuiThemeProvider } from "@comet/admin";
import { createCometTheme } from "@comet/admin-theme";
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
                {/* @ts-expect-error type mismatch between React 17 and 18, will be fixed by updating the admin packages */}
                <Typography variant="h2">Title</Typography>
                {/* @ts-expect-error type mismatch between React 17 and 18, will be fixed by updating the admin packages */}
                <Typography>
                    Lorem ipsum etiam porta sem malesuada magna mollis euismod. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Nullam
                    quis risus eget urna mollis ornare vel eu leo.
                </Typography>
            </ContentOverflow>
        </MuiThemeProvider>
    );
}

export default Story;
