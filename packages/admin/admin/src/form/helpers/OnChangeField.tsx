// Inspired by https://github.com/final-form/react-final-form-listeners/blob/master/src/OnChange.js
import { useEffect, useRef } from "react";
import { useField } from "react-final-form";

type Props = { name: string; children: (value: any, previousValue: any) => void };

function OnChangeField({ name, children }: Props) {
    const { input } = useField(name);
    const previousValue = useRef(input.value);

    useEffect(() => {
        if (input.value !== previousValue.current) {
            children(input.value, previousValue.current);
            previousValue.current = input.value;
        }
    }, [input.value, children]);

    return null;
}

export { OnChangeField };
