import styles from "./BackgroundBlock.module.scss";
import { ThemeModeProvider } from "./ThemeModeProvider";

type Props = {
    children: React.ReactNode;
    mode: "default" | "inverted";
};

export const BackgroundBlock = ({ children, mode }: Props) => {
    return (
        <ThemeModeProvider mode={mode}>
            <div className={styles.root}>
                <pre>[{mode.toUpperCase()}] Background Block:</pre>
                {children}
            </div>
        </ThemeModeProvider>
    );
};
