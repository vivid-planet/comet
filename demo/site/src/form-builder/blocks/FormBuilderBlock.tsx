"use client";

import { BlocksBlock, PropsWithData, SupportedBlocks } from "@comet/cms-site";
import { FormBuilderBlockData } from "@src/blocks.generated";
import { ReactNode } from "react";
import { Form } from "react-final-form";
import { FormattedMessage } from "react-intl";
import { styled } from "styled-components";

import { CheckboxListBlock } from "./fields/CheckboxListBlock";
import { RadioBlock } from "./fields/RadioBlock";
import { SelectBlock } from "./fields/SelectBlock";
import { TextAreaBlock } from "./fields/TextAreaBlock";
import { TextInputBlock } from "./fields/TextInputBlock";

const getSupportedBlocks = (formId: string): SupportedBlocks => {
    return {
        textInput: (props) => <TextInputBlock data={props} formId={formId} />,
        textArea: (props) => <TextAreaBlock data={props} formId={formId} />,
        select: (props) => <SelectBlock data={props} formId={formId} />,
        checkboxList: (props) => <CheckboxListBlock data={props} formId={formId} />,
        radio: (props) => <RadioBlock data={props} formId={formId} />,
    };
};

const submitValues = async (values: Record<string, unknown>) => {
    // TODO: Actually submit the data

    // eslint-disable-next-line no-console
    console.log("Submitting values", values);
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
            {({ handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                    <FieldsWrapper>
                        <BlocksBlock data={data} supportedBlocks={getSupportedBlocks(formId)} />
                    </FieldsWrapper>
                    <SubmitButton type="submit">
                        {submitButtonText ? submitButtonText : <FormattedMessage id="formBuilder.form.submit" defaultMessage="Absenden" />}
                    </SubmitButton>
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
