import { storiesOf } from "@storybook/react";
import { FinalFormDatePicker } from "@vivid-planet/react-admin-date-picker";
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
                        <Field name="date" label="Zeitraum" color="primary" component={FinalFormDatePicker} showClearDate />
                    </form>
                )}
            />
        </IntlProvider>
    );
};

storiesOf("react-admin-date-picker", module).add("Date Picker", () => <Story />);
