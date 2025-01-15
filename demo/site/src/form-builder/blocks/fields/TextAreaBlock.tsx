"use client";

import { hasRichTextBlockContent, PropsWithData, withPreview } from "@comet/cms-site";
import { TextAreaBlockData } from "@src/blocks.generated";
import { Field, FieldRenderProps } from "react-final-form";
import { styled } from "styled-components";

import { textInputStyles } from "../../common/formStyles";
import { Label } from "../../common/Label";
import { HelperTextBlock } from "../common/HelperTextBlock";

type Props = PropsWithData<TextAreaBlockData> & {
    formId: string;
};

export const TextAreaBlock = withPreview(
    ({ data: { label, fieldName, mandatory, helperText, placeholder }, formId }: Props) => {
        if (!fieldName) return null;

        const uniqueId = `${formId}-${fieldName}`;

        return (
            <div>
                <Label htmlFor={uniqueId} required={mandatory}>
                    {label}
                </Label>
                <Field name={fieldName} id={uniqueId} component={FieldComponent} placeholder={placeholder} required={mandatory} />
                {hasRichTextBlockContent(helperText) && <HelperTextBlock data={helperText} />}
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
