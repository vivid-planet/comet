import { storiesOf } from "@storybook/react";
import { LocaleContextProvider } from "@vivid-planet/comet-admin";
import { FinalFormDatePicker } from "@vivid-planet/comet-admin-date-picker";
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
                render={() => (
                    <form>
                        <Field name="date" label="Zeitraum" color="primary" component={FinalFormDatePicker} showClearDate />
                    </form>
                )}
            />
        </LocaleContextProvider>
    );
};

storiesOf("comet-admin-date-picker", module).add("Date Picker", () => <Story />);
