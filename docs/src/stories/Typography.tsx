import { Box, Typography } from "@mui/material";

function Story() {
    return (
        <Box>
            <Typography>You can add unordered lists:</Typography>
            <Typography variant="list">
                <Typography variant="listItem">A</Typography>
                <Typography variant="listItem">B</Typography>
                <Typography variant="listItem">C</Typography>
            </Typography>
            <Typography>Or ordered lists:</Typography>
            <Typography variant="list" component="ol">
                <Typography variant="listItem">One</Typography>
                <Typography variant="listItem">Two</Typography>
                <Typography variant="listItem">Three</Typography>
            </Typography>
        </Box>
    );
}

export default Story;
