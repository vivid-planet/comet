import { storiesOf } from "@storybook/react";
import { LocaleContextProvider } from "@vivid-planet/react-admin-date-fns";
import { DateRangePicker } from "@vivid-planet/react-admin-date-picker";
import { de as dateFnsLocaleDe } from "date-fns/locale";
import * as React from "react";
import { Field, Form } from "react-final-form";

const Story = () => {
    return (
        <LocaleContextProvider name="de" locale={dateFnsLocaleDe}>
            <Form
                onSubmit={() => {
                    // do nothing
                }}
                render={() => {
                    return (
                        <form>
                            <Field name="date" label="Zeitraum" component={DateRangePicker} showClearDates />
                        </form>
                    );
                }}
            />
        </LocaleContextProvider>
    );
};

storiesOf("react-admin-date-picker", module).add("Date Range Picker", () => <Story />);
