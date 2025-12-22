import { type ReactNode } from "react";

interface CheckboxFieldProps {
    label: ReactNode;
    helperText?: string;
    required?: boolean;
}

export function CheckboxField({ label, helperText }: CheckboxFieldProps): React.ReactElement {
    return (
        <div>
            <input type="checkbox" />
            <label>{label}</label>
            {helperText && <div>{helperText}</div>}
        </div>
    );
}
