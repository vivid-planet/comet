import { BlockRoot } from "./BlockRoot";
import styles from "./TextBlock.module.scss";

export const TextBlock = ({ text }: { text: string }) => {
    return (
        <BlockRoot className={styles.root} invertedClassName={styles["root--inverted"]}>
            <h4>Text Block</h4>
            <p>{text}</p>
        </BlockRoot>
    );
};
