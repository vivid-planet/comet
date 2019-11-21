import { storiesOf } from "@storybook/react";
import { ILocaleContextProps, LocaleContext } from "@vivid-planet/react-admin-date-fns";
import { SingleDatePicker } from "@vivid-planet/react-admin-date-picker";
import { de as dateFnsLocaleDe } from "date-fns/locale";
import * as React from "react";
import { Field, Form } from "react-final-form";

const Story = () => {
    const newLocale: ILocaleContextProps = dateFnsLocaleDe;
    newLocale.localeName = "de";
    return (
        <LocaleContext.Provider value={newLocale}>
            <Form
                onSubmit={() => {
                    // do nothing
                }}
                render={() => (
                    <form>
                        <Field name="date" label="Zeitraum" component={SingleDatePicker} showClearDate />
                    </form>
                )}
            />
        </LocaleContext.Provider>
    );
};

storiesOf("react-admin-date-picker", module).add("Single Date Picker", () => <Story />);
