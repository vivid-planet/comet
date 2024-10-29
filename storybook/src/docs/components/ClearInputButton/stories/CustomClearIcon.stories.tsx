import { ClearInputButton } from "@comet/admin";
import { Cut } from "@comet/admin-icons";
import { Box, InputAdornment, InputBase, Typography } from "@mui/material";
import * as React from "react";

export default {
    title: "stories/components/Clear Input Button/Custom Clear Icon",
};

export const CustomClearIcon = () => {
    return (
        <Box display="flex" alignItems="center">
            <Box marginRight={15}>
                <Typography variant="body1">Input Field with Custom ClearInputButton Icon:</Typography>
            </Box>
            <InputBase
                endAdornment={
                    <InputAdornment position="end">
                        <ClearInputButton icon={<Cut />} />
                    </InputAdornment>
                }
            />
        </Box>
    );
};
