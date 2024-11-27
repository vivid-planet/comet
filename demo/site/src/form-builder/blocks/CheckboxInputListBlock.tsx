import { PropsWithData, withPreview } from "@comet/cms-site";
import { CheckboxInputListBlockData } from "@src/blocks.generated";
import { Field, FieldRenderProps } from "react-final-form";
import styled from "styled-components";

import { Label } from "../FormComponents";
import { AdditionalFieldRichTextBlock } from "./AdditionalFieldRichTextBlock";

type Props = PropsWithData<CheckboxInputListBlockData> & {
    formId: string;
};

export const CheckboxInputListBlock = withPreview(
    ({ data: { label, required, name, items }, formId }: Props) => {
        const uniqueName = `${formId}-${name}`;

        return (
            <div>
                <Label required={required}>{label}</Label>
                {items.blocks.map(({ key, props }) => {
                    const uniqueInputName = `${uniqueName}-${props.name}`;
                    return (
                        <InputAndTextWrapper key={key}>
                            <Field name={uniqueName} id={uniqueInputName} component={FFCheckboxInput} type="checkbox" value={props.name} />
                            <AdditionalFieldRichTextBlock data={props.text} htmlFor={uniqueInputName} />
                        </InputAndTextWrapper>
                    );
                })}
            </div>
        );
    },
    { label: "RadioInputList" },
);

const CheckboxInput = styled.input``;

export const FFCheckboxInput = ({ meta, input, ...restProps }: FieldRenderProps<unknown>) => {
    return <CheckboxInput {...input} {...restProps} />;
};

const InputAndTextWrapper = styled.div`
    display: flex;
    align-items: center;
`;
