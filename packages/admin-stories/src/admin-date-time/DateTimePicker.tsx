import { Field } from "@comet/admin";
import { FinalFormDateTimePicker } from "@comet/admin-date-time";
import { AccessTime, Today } from "@material-ui/icons";
import { storiesOf } from "@storybook/react";
import * as moment from "moment";
import * as React from "react";
import { Form } from "react-final-form";
import { IntlProvider } from "react-intl";

const Story = () => {
    const initialValues = {
        datetime2: moment().toDate(),
        datetime3: moment().toDate(),
    };
    return (
        <IntlProvider messages={{}} locale="de">
            <Form onSubmit={() => {}} initialValues={initialValues}>
                {() => (
                    <form style={{ width: 350 }}>
                        <Field
                            name="datetime1"
                            dateInputLabel={"Date"}
                            timeInputLabel={"Time"}
                            component={FinalFormDateTimePicker}
                            datePickerProps={{ endAdornment: <Today fontSize={"small"} /> }}
                            timePickerProps={{ endAdornment: <AccessTime fontSize={"small"} /> }}
                            fullWidth
                        />
                        <Field name="datetime2" label={"Date & Time"} component={FinalFormDateTimePicker} />
                        <Field name="datetime3" label={"Date & Time"} component={FinalFormDateTimePicker} required />
                        <Field name="datetime4" dateInputLabel={"Date"} timeInputLabel={"Time"} component={FinalFormDateTimePicker} disabled />
                    </form>
                )}
            </Form>
        </IntlProvider>
    );
};

storiesOf("@comet/admin-date-time", module).add("Date-Time Picker", () => <Story />);
