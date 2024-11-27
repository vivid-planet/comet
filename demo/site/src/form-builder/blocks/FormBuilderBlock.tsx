"use client";

import { BlocksBlock, PropsWithData, SupportedBlocks } from "@comet/cms-site";
import { FormBuilderBlockData } from "@src/blocks.generated";
import { ReactNode } from "react";
import { Form } from "react-final-form";
import { FormattedMessage } from "react-intl";
import { styled } from "styled-components";

import { CheckboxInputBlock } from "./CheckboxInputBlock";
import { CheckboxInputListBlock } from "./CheckboxInputListBlock";
import { RadioInputListBlock } from "./RadioInputListBlock";
import { TextInputBlock } from "./TextInputBlock";

// TODO: Implement real blocks
const getFormBlocks = (formId: string): SupportedBlocks => {
    return {
        textInput: (props) => <TextInputBlock data={props} formId={formId} />,
        checkboxInput: (props) => <CheckboxInputBlock data={props} formId={formId} />,
        radioInputList: (props) => <RadioInputListBlock data={props} formId={formId} />,
        checkboxInputList: (props) => <CheckboxInputListBlock data={props} formId={formId} />,
    };
};

// TODO: Implement real blocks
const contentBlocks: SupportedBlocks = {
    // space: (props) => <hr />, // TODO
    // richtext
};

const submitValues = async (values: Record<string, unknown>) => {
    console.log("### Submitting values", values);
    // TODO: Actually submit the values
    // const response = await fetch("/api/form-builder", {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(values),
    // });
};

interface Props extends PropsWithData<FormBuilderBlockData> {
    submitButtonText?: ReactNode;
    formId: string;
}

export const FormBuilderBlock = ({
    data,
    submitButtonText = <FormattedMessage id="formBuilder.form.submit" defaultMessage="Submit" />,
    formId,
}: Props) => {
    return (
        <Form onSubmit={submitValues}>
            {({ handleSubmit, values }) => (
                <form onSubmit={handleSubmit}>
                    <FieldsWrapper>
                        <BlocksBlock data={data} supportedBlocks={{ ...getFormBlocks(formId), ...contentBlocks }} />
                    </FieldsWrapper>
                    <SubmitButton type="submit">
                        {submitButtonText ? submitButtonText : <FormattedMessage id="formBuilder.form.submit" defaultMessage="Absenden" />}
                    </SubmitButton>

                    <pre>{JSON.stringify(values, null, 2)}</pre>
                </form>
            )}
        </Form>
    );
};

const FieldsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
`;

const SubmitButton = styled.button`
    appearance: none;
    border: none;
    background-color: blue;
    padding: 5px 20px;
    color: white;
    border-radius: 0;
    cursor: pointer;
`;
