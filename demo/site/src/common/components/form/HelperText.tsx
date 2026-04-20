import clsx from "clsx";
import { type ReactNode } from "react";

import styles from "./HelperText.module.scss";

type HelperTextProps = {
    children: ReactNode;
    id?: string;
    className?: string;
};

export const HelperText: React.FC<HelperTextProps> = ({ children, id, className }) => {
    return (
        <div id={id} className={clsx(styles.helperText, className)}>
            {children}
        </div>
    );
};
