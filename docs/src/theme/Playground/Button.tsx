import React from "react";

import styles from "./button.module.css";

interface ButtonProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    endIcon: React.ReactNode;
}

export function Button({ children, endIcon, ...props }: ButtonProps) {
    return (
        <button className={styles.button} {...props}>
            {children} {endIcon}
        </button>
    );
}
