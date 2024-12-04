import { FieldSet, TextField } from "@comet/admin";
import * as React from "react";
import { Form } from "react-final-form";

export default {
    title: "@comet/admin/form",
};

export const FieldContainer = () => {
    return (
        <Form
            onSubmit={() => {
                // do nothing
            }}
            render={({ handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                    <FieldSet title="HORIZONTAL (Full-width)">
                        <TextField name="textFieldWithLabelOne" label="TextField label" variant="horizontal" fullWidth />
                        <TextField name="textFieldWithLabelTwo" label="TextField label" variant="horizontal" fullWidth />
                        <TextField name="testWithoutLabel" variant="horizontal" placeholder="TextField without label" fullWidth />
                    </FieldSet>
                    <FieldSet title="VERTICAL (Full-width)">
                        <TextField name="textFieldWithLabelOne" label="TextField label" variant="vertical" fullWidth />
                        <TextField name="textFieldWithLabelTwo" label="TextField label" variant="vertical" fullWidth />
                        <TextField name="testWithoutLabel" variant="vertical" placeholder="TextField without label" fullWidth />
                    </FieldSet>
                    <FieldSet title="HORIZONTAL (auto-width)">
                        <TextField name="textFieldWithLabelOne" label="TextField label" variant="horizontal" />
                        <TextField name="textFieldWithLabelTwo" label="TextField label" variant="horizontal" />
                        <TextField name="testWithoutLabel" variant="horizontal" placeholder="TextField without label" />
                    </FieldSet>
                    <FieldSet title="VERTICAL (auto-width)">
                        {/* FieldSet is not made to include non-full-width fields. Adding this `div` removes the flex-behaviour of FieldSet, allowing this example. */}
                        <div>
                            <TextField name="textFieldWithLabelOne" label="TextField label" variant="vertical" />
                            <TextField name="textFieldWithLabelTwo" label="TextField label" variant="vertical" />
                            <TextField name="testWithoutLabel" variant="vertical" placeholder="TextField without label" />
                        </div>
                    </FieldSet>
                </form>
            )}
        />
    );
};
