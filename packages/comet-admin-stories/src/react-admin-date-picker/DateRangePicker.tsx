import { storiesOf } from "@storybook/react";
import { FinalFormDateRangePicker } from "@vivid-planet/comet-admin-date-picker";
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
                render={() => {
                    return (
                        <form>
                            <Field name="date" label="Zeitraum" color="primary" component={FinalFormDateRangePicker} showClearDates />
                        </form>
                    );
                }}
            />
        </IntlProvider>
    );
};

storiesOf("comet-admin-date-picker", module).add("Date Range Picker", () => <Story />);
