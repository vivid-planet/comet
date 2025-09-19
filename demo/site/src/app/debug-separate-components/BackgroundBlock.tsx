type Props = {
    children: React.ReactNode;
    mode: "default" | "inverted";
};

export const BackgroundBlock = ({ children, mode }: Props) => {
    return (
        <div className={mode === "inverted" ? "backgroundBlock--default" : "backgroundBlock--inverted"}>
            <pre>[{mode.toUpperCase()}] Background Block:</pre>
            {children}
        </div>
    );
};
