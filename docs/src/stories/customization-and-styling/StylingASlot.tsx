import { ContentOverflow } from "@comet/admin";
import { Typography } from "@mui/material";

function Story() {
    return (
        <ContentOverflow
            slotProps={{
                openDialogIcon: {
                    sx: {
                        fontSize: 40,
                        color: "fuchsia",
                    },
                },
            }}
        >
            <Typography variant="h2">Title</Typography>
            <Typography>
                Lorem ipsum etiam porta sem malesuada magna mollis euismod. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Nullam quis
                risus eget urna mollis ornare vel eu leo.
            </Typography>
        </ContentOverflow>
    );
}

export default Story;
