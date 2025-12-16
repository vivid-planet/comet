interface CheckboxFieldProps {
    label: React.ReactNode;
    helperText?: string;
    required?: boolean;
}

export function CheckboxField({ label, helperText, required = false }: CheckboxFieldProps): React.ReactElement {
    return (
        <div>
            <label>
                <input type="checkbox" required={required} />
                {label}
                {required && <span>*</span>}
            </label>
            {helperText && <div>{helperText}</div>}
        </div>
    );
}
