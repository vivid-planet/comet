import { type ButtonHTMLAttributes, type DetailedHTMLProps } from "react";

import styles from "./button.module.css";

interface ButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    isOpen: boolean;
}

export function Button({ children, isOpen, ...props }: ButtonProps) {
    return (
        <button className={`${styles.button} ${isOpen ? "" : styles.buttonCollapsed}`} {...props}>
            {children}
        </button>
    );
}
