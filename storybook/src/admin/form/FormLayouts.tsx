import { Field, FinalForm, FinalFormInput, FormSection } from "@comet/admin";
import { Card, CardContent, Grid } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { apolloRestStoryDecorator } from "../../apollo-rest-story.decorator";

function VerticalFields() {
    return (
        <Card variant="outlined">
            <CardContent>
                <FormSection title="Vertical Fields" disableMarginBottom>
                    <Field label="Foo" placeholder="Foo" name="foo1" component={FinalFormInput} />
                    <Field label="Bar" placeholder="Bar" name="bar1" component={FinalFormInput} />
                    <Field label="Disabled" placeholder="Disabled" name="disabled1" disabled component={FinalFormInput} />
                    <Field label="Required" placeholder="Required" name="required1" required component={FinalFormInput} />
                </FormSection>
            </CardContent>
        </Card>
    );
}

function HorizontalFields() {
    return (
        <Card variant="outlined">
            <CardContent>
                <FormSection title="Horizontal Fields" disableMarginBottom>
                    <Field label="Foo" placeholder="Foo" name="foo2" component={FinalFormInput} variant="horizontal" />
                    <Field label="Bar" placeholder="Bar" name="bar2" component={FinalFormInput} variant="horizontal" />
                    <Field label="Disabled" placeholder="Disabled" name="disabled2" disabled component={FinalFormInput} variant="horizontal" />
                    <Field label="Required" placeholder="Required" name="required2" required component={FinalFormInput} variant="horizontal" />
                </FormSection>
            </CardContent>
        </Card>
    );
}

function FieldsInGrid() {
    return (
        <Card variant="outlined">
            <CardContent>
                <FormSection title="Fields in Grid" disableMarginBottom>
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Field label="Foo" placeholder="Foo" name="foo3" fullWidth component={FinalFormInput} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Field label="Bar" placeholder="Bar" name="bar3" fullWidth component={FinalFormInput} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Field label="Disabled" placeholder="Disabled" name="disabled3" disabled fullWidth component={FinalFormInput} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Field label="Required" placeholder="Required" name="required3" required fullWidth component={FinalFormInput} />
                        </Grid>
                    </Grid>
                </FormSection>
            </CardContent>
        </Card>
    );
}

function Story() {
    return (
        <FinalForm mode="edit" onSubmit={() => {}}>
            <Grid container spacing={8} style={{ maxWidth: 1024 }}>
                <Grid item xs={12}>
                    <VerticalFields />
                </Grid>
                <Grid item xs={12}>
                    <HorizontalFields />
                </Grid>
                <Grid item xs={12}>
                    <FieldsInGrid />
                </Grid>
            </Grid>
        </FinalForm>
    );
}

storiesOf("@comet/admin/form", module)
    .addDecorator(apolloRestStoryDecorator())
    .add("Form Layouts", () => <Story />);
