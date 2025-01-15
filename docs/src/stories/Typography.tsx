import { Box, Typography } from "@mui/material";
// eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-imports

function Story() {
    return (
        /* @ts-expect-error type mismatch between React 17 and 18, will be fixed by updating the admin packages */
        <Box>
            {/* @ts-expect-error type mismatch between React 17 and 18, will be fixed by updating the admin packages */}
            <Typography>You can add unordered lists:</Typography>
            {/* @ts-expect-error type mismatch between React 17 and 18, will be fixed by updating the admin packages */}
            <Typography variant="list">
                {/* @ts-expect-error type mismatch between React 17 and 18, will be fixed by updating the admin packages */}
                <Typography variant="listItem">A</Typography>
                {/* @ts-expect-error type mismatch between React 17 and 18, will be fixed by updating the admin packages */}
                <Typography variant="listItem">B</Typography>
                {/* @ts-expect-error type mismatch between React 17 and 18, will be fixed by updating the admin packages */}
                <Typography variant="listItem">C</Typography>
            </Typography>
            {/* @ts-expect-error type mismatch between React 17 and 18, will be fixed by updating the admin packages */}
            <Typography>Or ordered lists:</Typography>
            {/* @ts-expect-error type mismatch between React 17 and 18, will be fixed by updating the admin packages */}
            <Typography variant="list" component="ol">
                {/* @ts-expect-error type mismatch between React 17 and 18, will be fixed by updating the admin packages */}
                <Typography variant="listItem">One</Typography>
                {/* @ts-expect-error type mismatch between React 17 and 18, will be fixed by updating the admin packages */}
                <Typography variant="listItem">Two</Typography>
                {/* @ts-expect-error type mismatch between React 17 and 18, will be fixed by updating the admin packages */}
                <Typography variant="listItem">Three</Typography>
            </Typography>
        </Box>
    );
}

export default Story;
