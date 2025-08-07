import { Field } from "@comet/admin";
import { FinalFormTimePicker } from "@comet/admin-date-time";
import { Card, CardContent } from "@mui/material";
import { Form } from "react-final-form";

export default {
    title: "@comet/admin-date-time",
};

export const TimePicker = () => {
    interface Values {
        timeOne?: string;
        timeTwo?: string;
    }

    const initialValues: Partial<Values> = {
        timeOne: undefined,
        timeTwo: "11:30",
    };

    return (
        <div style={{ width: 500 }}>
            <Form<Values> onSubmit={() => {}} initialValues={initialValues}>
                {({ values, form: { change } }) => (
                    <form>
                        <Card>
                            <CardContent>
                                <Field name="timeOne" label="Time" fullWidth component={FinalFormTimePicker} />
                                <Field name="timeTwo" label="Required" fullWidth required component={FinalFormTimePicker} />
                            </CardContent>
                        </Card>
                        <pre>{JSON.stringify(values, null, 4)}</pre>
                    </form>
                )}
            </Form>
        </div>
    );
};
