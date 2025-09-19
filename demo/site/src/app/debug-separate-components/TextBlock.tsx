import styles from "./TextBlock.module.scss";

const worksToEmoji = {
    yes: "✅",
    no: "❌",
    maybe: "🤔",
};

export const TextBlock = ({ text, works = "maybe" }: { text: string; works?: "yes" | "no" | "maybe" }) => {
    return (
        <div className={styles.root}>
            <h4>{worksToEmoji[works]} Text Block</h4>
            <p>{text}</p>
        </div>
    );
};
