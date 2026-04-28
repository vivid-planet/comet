import { SvgUse } from "@src/common/helpers/SvgUse";
import clsx from "clsx";
import type { ReactNode } from "react";

import styles from "./ErrorText.module.scss";

type ErrorTextProps = {
    children: ReactNode;
    id?: string;
    className?: string;
};

export const ErrorText: React.FC<ErrorTextProps> = ({ children, id, className }) => {
    return (
        <div id={id} className={clsx(styles.errorWrapper, className)}>
            <SvgUse href="/assets/icons/error.svg#root" width={16} height={16} />
            {children}
        </div>
    );
};
