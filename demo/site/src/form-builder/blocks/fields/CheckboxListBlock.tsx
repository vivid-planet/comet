"use client";

import { hasRichTextBlockContent, PropsWithData } from "@comet/cms-site";
import { CheckboxListBlockData } from "@src/blocks.generated";
import { InfoTextBlock } from "@src/form-builder/blocks/common/InfoTextBlock";
import { Field } from "react-final-form";
import styled from "styled-components";

interface Props extends PropsWithData<CheckboxListBlockData> {
    formId: string;
}

export const CheckboxListBlock = ({ data: { label, fieldName, infoText, items, mandatory }, formId }: Props) => {
    if (!fieldName) return null;

    return (
        <>
            <div>
                {label}
                {mandatory && <span>*</span>}
            </div>
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
                                        <InfoTextBlock data={props.label} />
                                        {props.mandatory && <span>*</span>}
                                    </span>
                                    {hasRichTextBlockContent(props.infoText) && <InfoTextBlock data={props.infoText} />}
                                </CheckboxItem>
                            )}
                        />
                    );
                })}
                {hasRichTextBlockContent(infoText) && <InfoTextBlock data={infoText} />}
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
