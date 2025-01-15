"use client";

import { hasRichTextBlockContent, PropsWithData, withPreview } from "@comet/cms-site";
import { TextInputBlockData } from "@src/blocks.generated";
import { HTMLInputTypeAttribute } from "react";
import { Field, FieldRenderProps } from "react-final-form";
import { styled } from "styled-components";

import { textInputStyles } from "../../common/formStyles";
import { Label } from "../../common/Label";
import { HelperTextBlock } from "../common/HelperTextBlock";

type Props = PropsWithData<TextInputBlockData> & {
    formId: string;
};

const typeAttributeMap: Record<TextInputBlockData["inputType"], HTMLInputTypeAttribute> = {
    number: "number",
    text: "text",
    email: "email",
    phone: "tel",
};

export const TextInputBlock = withPreview(
    ({ data: { label, fieldName, mandatory, helperText, inputType, placeholder, unit }, formId }: Props) => {
        if (!fieldName) return null;

        const uniqueId = `${formId}-${fieldName}`;

        const fieldNode = (
            <Field
                type={typeAttributeMap[inputType]}
                name={fieldName}
                id={uniqueId}
                component={FieldComponent}
                placeholder={placeholder}
                required={mandatory}
            />
        );

        return (
            <div>
                <Label htmlFor={uniqueId} required={mandatory}>
                    {label}
                </Label>
                {inputType === "number" && unit ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        {fieldNode}
                        {unit && <span>{unit}</span>}
                    </div>
                ) : (
                    fieldNode
                )}
                {hasRichTextBlockContent(helperText) && <HelperTextBlock data={helperText} />}
            </div>
        );
    },
    { label: "TextInput" },
);

const Input = styled.input`
    ${textInputStyles}
`;

export const FieldComponent = ({ meta, input, ...restProps }: FieldRenderProps<string>) => {
    return <Input {...input} {...restProps} />;
};
