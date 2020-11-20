import { Button, ListItem, Typography } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import { materialUiReactSelect } from "@vivid-planet/react-admin";
import * as React from "react";

const { ReactSelect } = materialUiReactSelect;

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

storiesOf("material-ui-react-select", module).add("React Select Disabled Option", () => <Story />);
