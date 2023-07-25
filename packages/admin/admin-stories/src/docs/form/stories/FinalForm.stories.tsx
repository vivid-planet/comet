import { Field, FinalForm, FinalFormInput, FormSection, RouterTab, RouterTabs, SaveButton } from "@comet/admin";
import { useFormApiRef } from "@comet/admin/lib/FinalForm";
import { storiesOf } from "@storybook/react";
import { createMemoryHistory } from "history";
import * as React from "react";
import { Router } from "react-router";

import { apolloRestStoryDecorator } from "../../../apollo-rest-story.decorator";

storiesOf("stories/form/FinalForm", module)
    .addDecorator(apolloRestStoryDecorator())
    .add("Basic FinalForm", () => {
        return (
            <FinalForm
                mode="add"
                onSubmit={(values) => {
                    window.alert(JSON.stringify(values));
                }}
            >
                <FormSection>
                    <Field label="First name" name="firstname" placeholder="John" component={FinalFormInput} fullWidth />
                    <Field label="Last name" name="lastname" placeholder="Doe" component={FinalFormInput} fullWidth />
                </FormSection>
                <SaveButton type="submit" />
            </FinalForm>
        );
    })
    .add("FinalForm ApiRef", () => {
        const apiRef = useFormApiRef();
        return (
            <div>
                <FinalForm
                    apiRef={apiRef}
                    mode="add"
                    onSubmit={(values) => {
                        window.alert(JSON.stringify(values));
                    }}
                >
                    <FormSection>
                        <Field label="First name" name="firstname" placeholder="John" component={FinalFormInput} fullWidth />
                        <Field label="Last name" name="lastname" placeholder="Doe" component={FinalFormInput} fullWidth />
                    </FormSection>
                </FinalForm>
                <button
                    onClick={() => {
                        //Using apiRef can access FormApi outside of <FinalForm>
                        apiRef.current?.submit();
                    }}
                >
                    submit
                </button>
            </div>
        );
    })
    .add("FinalForm RouterTabs", () => {
        const history = createMemoryHistory();

        return (
            <Router history={history}>
                <FinalForm
                    mode="add"
                    onSubmit={(values) => {
                        window.alert(JSON.stringify(values));
                    }}
                >
                    <FormSection>
                        <RouterTabs>
                            <RouterTab key="general" label="General" path="">
                                <Field label="First name" name="firstname" placeholder="John" component={FinalFormInput} fullWidth />
                                <Field label="Last name" name="lastname" placeholder="Doe" component={FinalFormInput} fullWidth />
                            </RouterTab>
                            <RouterTab key="address" label="Address" path="/address">
                                <Field label="Postal code" name="postalCode" component={FinalFormInput} fullWidth />
                                <Field label="Street" name="street" component={FinalFormInput} fullWidth />
                                <Field label="Country" name="country" component={FinalFormInput} fullWidth />
                            </RouterTab>
                        </RouterTabs>
                    </FormSection>
                    <SaveButton type="submit" />
                </FinalForm>
            </Router>
        );
    });
