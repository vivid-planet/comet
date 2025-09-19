import clsx from "clsx";

import styles from "./BackgroundBlock.module.scss";

type Props = {
    children: React.ReactNode;
    mode: "default" | "inverted";
};

export const BackgroundBlock = ({ children, mode }: Props) => {
    return (
        <div className={clsx(styles.root, mode === "inverted" && styles["root--inverted"])}>
            <pre>[{mode.toUpperCase()}] Background Block:</pre>
            {children}
        </div>
    );
};
