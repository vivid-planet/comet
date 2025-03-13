import { ContentOverflow, createCometTheme, MuiThemeProvider } from "@comet/admin";
import { Preview } from "@comet/admin-icons";
import { Typography } from "@mui/material";

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
