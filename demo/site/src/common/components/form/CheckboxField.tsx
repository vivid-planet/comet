import { type ReactNode } from "react";

interface CheckboxFieldProps {
    label: ReactNode;
    helperText?: ReactNode;
    required?: boolean;
}

export function CheckboxField({ label, helperText }: CheckboxFieldProps) {
    return (
        <div>
            <input type="checkbox" />
            <label>{label}</label>
            {helperText && <div>{helperText}</div>}
        </div>
    );
}
