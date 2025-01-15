"use client";

import { hasRichTextBlockContent, PropsWithData } from "@comet/cms-site";
import { RadioBlockData } from "@src/blocks.generated";
import { createTextBlockRenderFn, defaultRichTextRenderers, RichTextBlock, RichTextBlockProps } from "@src/common/blocks/RichTextBlock";
import { Field } from "react-final-form";
import styled from "styled-components";

import { HelperTextBlock } from "../common/HelperTextBlock";

const LabelBlock = (props: RichTextBlockProps) => (
    <RichTextBlock
        renderers={{
            ...defaultRichTextRenderers,
            blocks: {
                unstyled: createTextBlockRenderFn({ variant: "p200" }),
            },
        }}
        {...props}
    />
);

interface Props extends PropsWithData<RadioBlockData> {
    formId: string;
}

export const RadioBlock = ({ data: { label, fieldName, helperText, items, mandatory }, formId }: Props) => {
    if (!fieldName) return null;

    return (
        <>
            <div>
                {label}
                {mandatory && <span>*</span>}
            </div>
            {hasRichTextBlockContent(helperText) && <HelperTextBlock data={helperText} />}
            <RadioGroup>
                {items.blocks.map(({ props }) => {
                    const uniqueId = `${formId}-${fieldName}-${props.fieldName}`;
                    return (
                        <Field
                            key={uniqueId}
                            name={fieldName}
                            type="radio"
                            value={props.fieldName}
                            render={({ input }) => (
                                <RadioItem>
                                    <input {...input} type="radio" />
                                    <span>
                                        <LabelBlock data={props.label} />
                                    </span>
                                    {hasRichTextBlockContent(props.helperText) && <HelperTextBlock data={props.helperText} />}
                                </RadioItem>
                            )}
                        />
                    );
                })}
            </RadioGroup>
        </>
    );
};

const RadioGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const RadioItem = styled.label`
    display: flex;
    flex-direction: row;
    gap: 10px;
`;
