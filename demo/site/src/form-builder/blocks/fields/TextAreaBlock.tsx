"use client";

import { hasRichTextBlockContent, PropsWithData, withPreview } from "@comet/cms-site";
import { TextAreaBlockData } from "@src/blocks.generated";
import { InfoTextBlock } from "@src/form-builder/blocks/common/InfoTextBlock";
import { Field, FieldRenderProps } from "react-final-form";
import { styled } from "styled-components";

import { textInputStyles } from "../../common/formStyles";
import { Label } from "../../common/Label";

type Props = PropsWithData<TextAreaBlockData> & {
    formId: string;
};

export const TextAreaBlock = withPreview(
    ({ data: { label, fieldName, mandatory, infoText, placeholder }, formId }: Props) => {
        if (!fieldName) return null;

        const uniqueId = `${formId}-${fieldName}`;

        return (
            <div>
                <Label htmlFor={uniqueId} required={mandatory}>
                    {label}
                </Label>
                <Field name={fieldName} id={uniqueId} component={FieldComponent} placeholder={placeholder} required={mandatory} />
                {hasRichTextBlockContent(infoText) && <InfoTextBlock data={infoText} />}
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
