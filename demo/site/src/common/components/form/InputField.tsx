interface InputProps {
    label: React.ReactNode;
    required?: boolean;
    placeholder?: string;
    helperText?: string;
    textArea?: boolean;
}

export function InputField({ label, required = false, placeholder, helperText, textArea = false }: InputProps): React.ReactElement {
    return (
        <div>
            <div>
                {label}
                {!required && <span>(optional)</span>}
            </div>
            {textArea ? <textarea required={required} placeholder={placeholder} /> : <input required={required} placeholder={placeholder} />}
            {helperText && <div>{helperText}</div>}
        </div>
    );
}
