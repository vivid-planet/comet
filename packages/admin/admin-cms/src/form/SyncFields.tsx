// Inspired by https://gist.github.com/erikras/9607902abb1df1e7991c0bd83abdc4b4#file-whenfieldchanges-js
import React from "react";
import { Field } from "react-final-form";
import { OnChange } from "react-final-form-listeners";

interface Props<TSourceFieldValue, TTargetFieldValue> {
    sourceField: string;
    targetField: string;
    onChange: (value: TSourceFieldValue) => TTargetFieldValue;
}

function SyncFields<TSourceFieldValue, TTargetFieldValue>({
    sourceField,
    targetField,
    onChange: changeHandler,
}: Props<TSourceFieldValue, TTargetFieldValue>): React.ReactElement {
    return (
        <Field name={targetField} subscription={{}}>
            {(
                // No subscription. We only use Field to get to the change function
                { input: { onChange } },
            ) => (
                <OnChange name={sourceField}>
                    {(value) => {
                        onChange(changeHandler(value));
                    }}
                </OnChange>
            )}
        </Field>
    );
}

export { SyncFields };
