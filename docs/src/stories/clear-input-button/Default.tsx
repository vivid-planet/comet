import { ClearInputButton } from "@comet/admin";
import { Box, InputAdornment, InputBase, Typography } from "@mui/material";
import * as React from "react";

function Story() {
    return (
        <Box display="flex" alignItems="center">
            <Box marginRight={15}>
                <Typography variant="body1">Input Field with Default ClearInputButton:</Typography>
            </Box>
            <InputBase
                endAdornment={
                    <InputAdornment position="end">
                        <ClearInputButton />
                    </InputAdornment>
                }
            />
        </Box>
    );
}
export default Story;
