import { Card, CardContent, Grid } from "@mui/material";
import { Form } from "react-final-form";

import { Field } from "../../form/Field";
import { FieldContainer } from "../../form/FieldContainer";
import { FinalFormRadio } from "../../form/Radio";

export default {
    title: "components/form",
};

export const Radio = () => {
    return (
        <div style={{ width: 600 }}>
            <Form
                initialValues={{
                    foo1: "bar2",
                    foo2: "bar2",
                    foo3: "bar2",
                    foo4: "bar2",
                }}
                onSubmit={(values) => {
                    //
                }}
                render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={4}>
                            <Grid size={6}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <FieldContainer label="Radios">
                                            <Field name="foo1" type="radio" value="bar1" fullWidth>
                                                {(props) => <FinalFormRadio {...props}>Unchecked</FinalFormRadio>}
                                            </Field>
                                            <Field name="foo1" type="radio" value="bar2" fullWidth>
                                                {(props) => <FinalFormRadio {...props}>Checked</FinalFormRadio>}
                                            </Field>
                                            <Field name="foo2" type="radio" value="bar1" fullWidth disabled>
                                                {(props) => <FinalFormRadio {...props}>Disabled</FinalFormRadio>}
                                            </Field>
                                            <Field name="foo2" type="radio" value="bar2" fullWidth disabled>
                                                {(props) => <FinalFormRadio {...props}>Disabled & Checked</FinalFormRadio>}
                                            </Field>
                                        </FieldContainer>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </form>
                )}
            />
        </div>
    );
};
