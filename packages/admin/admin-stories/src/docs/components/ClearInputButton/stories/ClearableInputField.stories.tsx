import { ClearInputButton } from "@comet/admin";
import { Box, InputAdornment, InputBase, Typography } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/components/Clear Input Button/Clearable Input Field", module).add("Clearable Input Field", () => {
    const [inputText, setInputText] = React.useState<string>("");

    return (
        <Box display={"flex"} alignItems={"center"}>
            <Box marginRight={15}>
                <Typography variant={"body1"}>Input Field with clearable onClick Button Functionality:</Typography>
            </Box>
            <InputBase
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                endAdornment={
                    <InputAdornment position="end">
                        <ClearInputButton onClick={() => setInputText("")} />
                    </InputAdornment>
                }
            />
        </Box>
    );
});
