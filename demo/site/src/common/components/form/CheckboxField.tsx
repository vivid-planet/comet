interface CheckboxFieldProps {
    label: React.ReactNode;
    helperText?: string;
    required?: boolean;
}

export function CheckboxField({ label, helperText }: CheckboxFieldProps): React.ReactElement {
    return (
        <div>
            <div>
                <input type="checkbox" />
                {label}
            </div>
            {helperText && <div>{helperText}</div>}
        </div>
    );
}
