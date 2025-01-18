"use client";

import { hasRichTextBlockContent, PropsWithData } from "@comet/cms-site";
import { CheckboxListBlockData } from "@src/blocks.generated";
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

interface Props extends PropsWithData<CheckboxListBlockData> {
    formId: string;
}

export const CheckboxListBlock = ({ data: { label, fieldName, helperText, items, mandatory }, formId }: Props) => {
    if (!fieldName) return null;

    return (
        <>
            <div>
                {label}
                {mandatory && <span>*</span>}
            </div>
            {hasRichTextBlockContent(helperText) && <HelperTextBlock data={helperText} />}
            <CheckboxList>
                {items.blocks.map(({ props }) => {
                    const uniqueId = `${formId}-${fieldName}-${props.fieldName}`;
                    return (
                        <Field
                            key={uniqueId}
                            name={uniqueId}
                            type="checkbox"
                            render={({ input }) => (
                                <CheckboxItem>
                                    <input {...input} type="checkbox" />
                                    <span>
                                        <LabelBlock data={props.label} />
                                        {props.mandatory && <span>*</span>}
                                    </span>
                                    {hasRichTextBlockContent(props.helperText) && <HelperTextBlock data={props.helperText} />}
                                </CheckboxItem>
                            )}
                        />
                    );
                })}
            </CheckboxList>
        </>
    );
};

const CheckboxList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const CheckboxItem = styled.label`
    display: flex;
    flex-direction: row;
    gap: 10px;
`;
