import { forwardRef, type InputHTMLAttributes } from "react";

interface CheckboxFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: React.ReactNode;
    helperText?: string;
    required?: boolean;
    error?: string;
}

export const CheckboxField = forwardRef<HTMLInputElement, CheckboxFieldProps>(({ label, helperText, required = false, error, ...rest }, ref) => {
    return (
        <div>
            <label>
                <input type="checkbox" ref={ref} required={required} {...rest} />
                {label}
                {required && <span>*</span>}
            </label>
            {error && <div style={{ color: "red" }}>{error}</div>}
            {helperText && <div>{helperText}</div>}
        </div>
    );
});
