import { Field } from "@comet/admin";
import { TimePicker } from "@comet/admin-date-time";
import Schedule from "@material-ui/icons/Schedule";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";
import { IntlProvider } from "react-intl";

const Story = () => {
    const initialValues = { time2: "11:30", time3: "11:30", time6: "11:30" };
    return (
        <IntlProvider messages={{}} locale="de">
            <Form onSubmit={() => {}} initialValues={initialValues}>
                {() => (
                    <form style={{ width: 350 }}>
                        <Field name="time1" label="Time - default" component={TimePicker} endAdornment={<Schedule fontSize={"small"} />} fullWidth />
                        <Field name="time2" label="Time - with clear-button" component={TimePicker} showClearButton />
                        <Field
                            name="time3"
                            label="Time - with clear-button and icon"
                            component={TimePicker}
                            startAdornment={<Schedule fontSize={"small"} />}
                            showClearButton
                        />
                        <Field
                            name="time4"
                            label="Time - with icons"
                            component={TimePicker}
                            startAdornment={<Schedule fontSize={"small"} />}
                            endAdornment={<Schedule fontSize={"small"} />}
                        />
                        <Field name="time5" disabled label="Time - disabled" component={TimePicker} />
                        <Field name="time6" required label="Time - required" component={TimePicker} />
                    </form>
                )}
            </Form>
        </IntlProvider>
    );
};

storiesOf("@comet/admin-date-time", module).add("Time Picker", () => <Story />);
