import { storiesOf } from "@storybook/react";
import { TimePicker } from "@vivid-planet/comet-admin-date-picker";
import * as React from "react";
import { Field, Form } from "react-final-form";
import { IntlProvider } from "react-intl";

const Story = () => {
    return (
        <IntlProvider messages={{}} locale="de">
            <Form
                onSubmit={() => {
                    // do nothing
                }}
                render={() => (
                    <form>
                        <Field name="date" label="Time" component={TimePicker} />
                    </form>
                )}
            />
        </IntlProvider>
    );
};

storiesOf("comet-admin-date-picker", module).add("Time Picker", () => <Story />);
