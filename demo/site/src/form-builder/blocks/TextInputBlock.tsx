import { PropsWithData, withPreview } from "@comet/cms-site";
import { TextInputBlockData } from "@src/blocks.generated";
import { Label } from "@src/form-builder/FormComponents";
import { Field } from "react-final-form";

import { FFInput, FFTextArea } from "../FormComponents";

type Props = PropsWithData<TextInputBlockData> & {
    formId: string;
};

export const TextInputBlock = withPreview(
    ({ data: { label, placeholder, required, type, name }, formId }: Props) => {
        const uniqueName = `${formId}-${name}`;
        return (
            <div>
                <Label htmlFor={uniqueName} required={required}>
                    {label}
                </Label>
                <Field
                    name={uniqueName}
                    id={uniqueName}
                    component={type === "multilineText" ? FFTextArea : FFInput}
                    placeholder={placeholder}
                    required={required}
                    type={getInputType(type)}
                />
            </div>
        );
    },
    { label: "TextInput" },
);

const getInputType = (type: TextInputBlockData["type"]) => {
    if (type === "multilineText") return undefined;
    if (type === "email") return "email";
    return "text";
};
