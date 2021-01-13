import { ReactSelect } from "@comet/admin-react-select";
import { Button, ListItem, Typography } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";

function Story() {
    const options = [
        { value: "chocolate", label: "Chocolate" },
        { value: "strawberry", label: "Strawberry", isDisabled: true },
        { value: "vanilla", label: "Vanilla" },
    ];
    return (
        <div style={{ width: "300px" }}>
            <ListItem>
                <Button component={"button"} disableTouchRipple>
                    <Typography variant="button">blah</Typography>
                </Button>
            </ListItem>

            <ReactSelect options={options} />
        </div>
    );
}

storiesOf("@comet/admin-react-select", module).add("React Select Disabled Option", () => <Story />);
