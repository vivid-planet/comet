import { Field } from "@comet/admin";
import { FinalFormDatePicker } from "@comet/admin-date-time";
import TodayIcon from "@material-ui/icons/Today";
import { storiesOf } from "@storybook/react";
import * as moment from "moment";
import * as React from "react";
import { Form } from "react-final-form";
import { IntlProvider } from "react-intl";

const Story = () => {
    const initialValues = {
        date2: moment().toDate(),
        date3: moment().toDate(),
        date4: moment().toDate(),
    };
    return (
        <IntlProvider messages={{}} locale="de">
            <Form onSubmit={() => {}} initialValues={initialValues}>
                {() => (
                    <form style={{ width: 350 }}>
                        <Field name="date1" label="Date" component={FinalFormDatePicker} fullWidth />
                        <Field name="date2" label="Date, with icon" component={FinalFormDatePicker} endAdornment={<TodayIcon fontSize={"small"} />} />
                        <Field name="date3" label="Date, with clear-button" component={FinalFormDatePicker} showClearButton />
                        <Field
                            name="date4"
                            label="Date, required"
                            required
                            component={FinalFormDatePicker}
                            startAdornment={<TodayIcon fontSize={"small"} />}
                        />
                        <Field name="date5" label="Date, disabled" disabled component={FinalFormDatePicker} />
                    </form>
                )}
            </Form>
        </IntlProvider>
    );
};

storiesOf("@comet/admin-date-time", module).add("Date Picker", () => <Story />);
