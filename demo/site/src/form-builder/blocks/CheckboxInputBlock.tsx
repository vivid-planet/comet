import { PropsWithData, withPreview } from "@comet/cms-site";
import { CheckboxInputBlockData } from "@src/blocks.generated";
import { AdditionalFieldRichTextBlock } from "@src/form-builder/blocks/AdditionalFieldRichTextBlock";
import { Field, FieldRenderProps } from "react-final-form";
import styled from "styled-components";

import { Label } from "../FormComponents";

type Props = PropsWithData<CheckboxInputBlockData> & {
    formId: string;
};

export const CheckboxInputBlock = withPreview(
    ({ data: { label, required, name, text }, formId }: Props) => {
        const uniqueName = `${formId}-${name}`;

        return (
            <div>
                <Label htmlFor={uniqueName} required={required}>
                    {label}
                </Label>
                <CheckboxAndTextWrapper>
                    <Field name={uniqueName} id={uniqueName} component={FFCheckboxInput} type="checkbox" required={required} />
                    <AdditionalFieldRichTextBlock data={text} htmlFor={uniqueName} />
                </CheckboxAndTextWrapper>
            </div>
        );
    },
    { label: "CheckboxInput" },
);

const CheckboxInput = styled.input``;

export const FFCheckboxInput = ({ meta, input, ...restProps }: FieldRenderProps<"true" | "false">) => {
    return <CheckboxInput {...input} {...restProps} />;
};

const CheckboxAndTextWrapper = styled.div`
    display: flex;
    align-items: center;
`;
