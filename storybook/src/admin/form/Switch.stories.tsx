import { Field, FinalFormSwitch } from "@comet/admin";
import { Box, Card, CardContent, Divider, FormControlLabel } from "@mui/material";
import { Form } from "react-final-form";

export default {
    title: "@comet/admin/form",
};

export const Switch = () => {
    return (
        <div style={{ width: 500 }}>
            <Form
                onSubmit={(values) => {
                    //
                }}
                render={({ handleSubmit, values }) => (
                    <form onSubmit={handleSubmit}>
                        <Card variant="outlined">
                            <CardContent>
                                <Field name="foo" label="Switch with yes, no">
                                    {(props) => <FormControlLabel label={values.foo ? "Yes" : "No"} control={<FinalFormSwitch {...props} />} />}
                                </Field>
                                <Box marginBottom={4}>
                                    <Divider />
                                </Box>
                                <Field name="bar">
                                    {(props) => <FormControlLabel label="Switch with label on the right" control={<FinalFormSwitch {...props} />} />}
                                </Field>
                            </CardContent>
                        </Card>
                    </form>
                )}
            />
        </div>
    );
};
