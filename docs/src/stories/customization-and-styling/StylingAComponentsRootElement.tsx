import { ContentOverflow } from "@comet/admin";
import { Typography } from "@mui/material";

function Story() {
    return (
        <ContentOverflow sx={{ backgroundColor: "lime" }}>
            <Typography variant="h2">Title</Typography>
            <Typography>
                Lorem ipsum etiam porta sem malesuada magna mollis euismod. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Nullam quis
                risus eget urna mollis ornare vel eu leo.
            </Typography>
        </ContentOverflow>
    );
}

export default Story;
