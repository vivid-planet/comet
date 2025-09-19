import styles from "./TextBlock.module.scss";

export const TextBlock = ({ text }: { text: string }) => {
    return (
        <section>
            <div className={styles.root}>
                <h4>Text Block</h4>
                <p>{text}</p>
            </div>
        </section>
    );
};
