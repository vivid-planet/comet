import { storiesOf } from "@storybook/react";
import { DateRangePicker } from "@vivid-planet/react-admin-date-picker";
import * as React from "react";
import { Field, Form } from "react-final-form";

const Story = () => {
    return (
        <Form
            onSubmit={() => {
                // do nothing
            }}
            render={() => (
                <form>
                    <Field name="date" label="Zeitraum" component={DateRangePicker} fullWidth />
                </form>
            )}
        />
    );
};

storiesOf("react-admin-date-picker", module).add("Date Range Picker", () => <Story />);
