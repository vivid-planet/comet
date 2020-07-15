import { ApolloProvider } from "@apollo/react-hooks";
import { storiesOf } from "@storybook/react";
import { FinalForm } from "@vivid-planet/react-admin-core";
import { Field, FormPaper, Input } from "@vivid-planet/react-admin-form";
import { InMemoryCache } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import { ApolloLink } from "apollo-link";
import { RestLink } from "apollo-link-rest";
import { SubmissionErrors } from "final-form";
import * as React from "react";

const onSubmit = ({ foo, bar }: { foo: string; bar: string }) => {
    const errors = [];
    if (foo !== "foo") {
        errors.push({ foo: `${foo} is not foo` });
    }
    if (bar !== "bar") {
        errors.push({ bar: `${bar} is not bar` });
    }
    return Promise.reject({ errors });
};

const resolveSubmitErrors = (error: SubmissionErrors): Promise<SubmissionErrors> => {
    return error.errors.reduce((acc: { [key: string]: any }, cur: { [key: string]: any }) => ({ ...acc, ...cur }), {});
};

function Story() {
    const initialValues = {
        foo: "foo",
    };

    return (
        <FinalForm mode="edit" onSubmit={onSubmit} initialValues={initialValues} resolveSubmitErrors={resolveSubmitErrors}>
            <div>
                <FormPaper>
                    <Field label="Foo" name="foo" component={Input} />
                </FormPaper>
                <FormPaper>
                    <Field label="Bar" name="bar" component={Input} />
                </FormPaper>
            </div>
        </FinalForm>
    );
}

storiesOf("react-admin-core", module)
    .addDecorator(story => {
        const link = ApolloLink.from([
            new RestLink({
                uri: "https://jsonplaceholder.typicode.com/",
            }),
        ]);

        const cache = new InMemoryCache();

        const client = new ApolloClient({
            link,
            cache,
        });

        return <ApolloProvider client={client}>{story()}</ApolloProvider>;
    })
    .add("FormSubmitErrors", () => <Story />);
