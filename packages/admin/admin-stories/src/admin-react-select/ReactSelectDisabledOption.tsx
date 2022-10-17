import { FormSection } from "@comet/admin";
import { ReactSelect } from "@comet/admin-react-select";
import { Card, CardContent } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry", isDisabled: true },
    { value: "vanilla", label: "Vanilla" },
];

function Story() {
    return (
        <Card variant="outlined" style={{ width: 400 }}>
            <CardContent>
                <FormSection title="React Select Disabled Option" disableMarginBottom>
                    <ReactSelect options={options} />
                </FormSection>
            </CardContent>
        </Card>
    );
}

storiesOf("@comet/admin-react-select", module).add("React Select Disabled Option", () => <Story />);
