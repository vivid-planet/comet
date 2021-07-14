import { FormPaper } from "@comet/admin";
import { ReactSelect } from "@comet/admin-react-select";
import { Box, Button } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";

function Story() {
    const options = [
        { value: "chocolate", label: "Chocolate" },
        { value: "strawberry", label: "Strawberry", isDisabled: true },
        { value: "vanilla", label: "Vanilla" },
    ];
    return (
        <FormPaper variant="outlined" style={{ width: 300 }}>
            <Box marginBottom={4}>
                <Button component={"button"} disableTouchRipple>
                    blah
                </Button>
            </Box>

            <ReactSelect options={options} />
        </FormPaper>
    );
}

storiesOf("@comet/admin-react-select", module).add("React Select Disabled Option", () => <Story />);
