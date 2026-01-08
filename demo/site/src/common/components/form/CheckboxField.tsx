import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

interface CheckboxFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: ReactNode;
    helperText?: ReactNode;
    required?: boolean;
    error?: ReactNode;
}

export const CheckboxField = forwardRef<HTMLInputElement, CheckboxFieldProps>(
    ({ label, helperText, required = false, error, ...inputProps }, ref) => {
        return (
            <div>
                <input ref={ref} type="checkbox" required={required} {...inputProps} />
                <label>{label}</label>
                {helperText && <div>{helperText}</div>}
                {error && <div style={{ color: "red" }}>{error}</div>}
            </div>
        );
    },
);
