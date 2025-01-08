"use client";

import { PropsWithData, withPreview } from "@comet/cms-site";
import { TextInputBlockData } from "@src/blocks.generated";
import { Field, FieldRenderProps } from "react-final-form";
import { styled } from "styled-components";

import { textInputStyles } from "../common/formStyles";
import { Label } from "../common/Label";

type Props = PropsWithData<TextInputBlockData> & {
    formId: string;
};

export const TextAreaBlock = withPreview(
    ({ data: { label, placeholder, required, name }, formId }: Props) => {
        if (!name) return null;

        const uniqueId = `${formId}-${name}`;

        return (
            <div>
                <Label htmlFor={uniqueId} required={required}>
                    {label}
                </Label>
                {/* @ts-expect-error TODO: Fix the error "'Field' cannot be used as a JSX component." */}
                <Field name={name} id={uniqueId} component={FieldComponent} placeholder={placeholder} required={required} />
            </div>
        );
    },
    { label: "TextArea" },
);

const TextArea = styled.textarea`
    ${textInputStyles}
    resize: vertical;
    min-height: 80px;
`;

export const FieldComponent = ({ meta, input, ...restProps }: FieldRenderProps<string>) => {
    return <TextArea {...input} {...restProps} />;
};
