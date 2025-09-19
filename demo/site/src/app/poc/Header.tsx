type Props = {
    title: string;
    description: string;
    infos: string[];
};

export const Header = ({ title, description, infos }: Props) => {
    return (
        <header style={{ minHeight: 300 }}>
            <h2>{title}</h2>
            <p>{description}</p>
            <ul>
                {infos.map((benefit, index) => (
                    <li key={index} style={{ marginBottom: 10 }}>
                        {benefit}
                    </li>
                ))}
            </ul>
        </header>
    );
};
