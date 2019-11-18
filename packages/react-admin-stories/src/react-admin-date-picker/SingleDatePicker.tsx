import { storiesOf } from "@storybook/react";
import { SingleDatePicker } from "@vivid-planet/react-admin-date-picker";
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
                    <Field name="date" label="Zeitraum" component={SingleDatePicker} fullWidth showClearDate />
                </form>
            )}
        />
    );
};

storiesOf("react-admin-date-picker", module).add("Single Date Picker", () => <Story />);
