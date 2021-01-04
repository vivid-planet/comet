import { storiesOf } from "@storybook/react";
import { DateTimePicker } from "@vivid-planet/comet-admin-date-picker";
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
                render={(props) => (
                    <div>
                        <code>{JSON.stringify(props.values)}</code>
                        <hr />
                        <form>
                            <Field name="datetime" label={"Publish date"} timeLabel={"Time"} component={DateTimePicker} />
                        </form>
                    </div>
                )}
            />
        </IntlProvider>
    );
};

storiesOf("comet-admin-date-picker", module).add("Date-Time Picker", () => <Story />);
