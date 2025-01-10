import { hasRichTextBlockContent, PropsWithData } from "@comet/cms-site";
import { SelectBlockData } from "@src/blocks.generated";
import { InfoTextBlock } from "@src/form-builder/blocks/common/InfoTextBlock";
import { Field } from "react-final-form";

import { Label } from "../../common/Label";

interface Props extends PropsWithData<SelectBlockData> {
    formId: string;
}

export function SelectBlock({ data: { selectType, placeholder, label, fieldName, infoText, mandatory, options }, formId }: Props) {
    if (!fieldName) return null;

    const uniqueId = `${formId}-${fieldName}`;

    return (
        <div>
            <Label htmlFor={uniqueId} required={mandatory}>
                {label}
            </Label>
            <Field name={fieldName} id={uniqueId}>
                {({ input }) => (
                    <select {...input} multiple={selectType === "multiSelect"}>
                        {placeholder && (
                            <option value="" selected disabled={mandatory}>
                                {placeholder}
                            </option>
                        )}
                        {options.blocks.map(({ props: { text, fieldName } }) => (
                            <option key={fieldName} value={fieldName}>
                                {text}
                            </option>
                        ))}
                    </select>
                )}
            </Field>
            {hasRichTextBlockContent(infoText) && <InfoTextBlock data={infoText} />}
        </div>
    );
}
