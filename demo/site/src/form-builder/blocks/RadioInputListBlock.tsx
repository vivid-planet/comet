import { PropsWithData, withPreview } from "@comet/cms-site";
import { RadioInputListBlockData } from "@src/blocks.generated";
import { Field, FieldRenderProps } from "react-final-form";
import styled from "styled-components";

import { Label } from "../FormComponents";
import { AdditionalFieldRichTextBlock } from "./AdditionalFieldRichTextBlock";

type Props = PropsWithData<RadioInputListBlockData> & {
    formId: string;
};

export const RadioInputListBlock = withPreview(
    ({ data: { label, required, name, items }, formId }: Props) => {
        const uniqueName = `${formId}-${name}`;

        return (
            <div>
                <Label required={required}>{label}</Label>
                {items.blocks.map(({ key, props }) => {
                    const uniqueInputName = `${uniqueName}-${props.name}`;
                    return (
                        <InputAndTextWrapper key={key}>
                            <Field
                                name={uniqueName}
                                id={uniqueInputName}
                                component={FFRadioInput}
                                type="radio"
                                value={props.name}
                                required={required}
                            />
                            <AdditionalFieldRichTextBlock data={props.text} htmlFor={uniqueInputName} />
                        </InputAndTextWrapper>
                    );
                })}
            </div>
        );
    },
    { label: "RadioInputList" },
);

const RadioInput = styled.input``;

export const FFRadioInput = ({ meta, input, ...restProps }: FieldRenderProps<unknown>) => {
    return <RadioInput {...input} {...restProps} />;
};

const InputAndTextWrapper = styled.div`
    display: flex;
    align-items: center;
`;
