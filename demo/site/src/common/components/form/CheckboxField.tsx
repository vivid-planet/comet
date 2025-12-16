import { Typography } from "../Typography";
import styles from "./CheckboxField.module.scss";

interface CheckboxFieldProps {
    label: React.ReactNode;
    helperText?: string;
    required?: boolean;
}

export function CheckboxField({ label, helperText, required }: CheckboxFieldProps): React.ReactElement {
    return (
        <div>
            <div className={styles.checkboxWrapper}>
                <input type="checkbox" className={styles.checkboxInput} />
                <label>
                    <Typography as="span" variant="paragraph300" className={styles.checkboxLabel}>
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
            </div>
            {helperText && (
                <div className={styles.helperText}>
                    <Typography variant="paragraph200">{helperText}</Typography>
                </div>
            )}
        </div>
    );
}
