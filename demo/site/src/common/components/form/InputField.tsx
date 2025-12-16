import { Typography } from "../Typography";
import styles from "./InputField.module.scss";

interface InputProps {
    label: React.ReactNode;
    required?: boolean;
    placeholder?: string;
    helperText?: string;
    textArea?: boolean;
}

export function InputField({ label, required = false, placeholder, helperText, textArea = false }: InputProps): React.ReactElement {
    return (
        <div className={styles.input}>
            <label className={styles.labelWrapper}>
                <Typography as="span" variant="paragraph300" className={styles.inputLabel}>
                    {label}
                </Typography>
                {!required && (
                    <span>
                        <Typography as="span" variant="paragraph200" color="var(--text-secondary)">
                            (optional)
                        </Typography>
                    </span>
                )}
            </label>
            {textArea ? (
                <textarea required={required} placeholder={placeholder} className={styles.inputField} />
            ) : (
                <input required={required} placeholder={placeholder} className={styles.inputField} />
            )}
            {helperText && (
                <div className={styles.helperText}>
                    <Typography variant="paragraph200">{helperText}</Typography>
                </div>
            )}
        </div>
    );
}
