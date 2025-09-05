import { Controls, type Of, Primary } from "@storybook/addon-docs/blocks";

type DocsPageProps = {
    defaultStory: Of;
};

export const DocsPage = ({ defaultStory }: DocsPageProps) => {
    return (
        <>
            <Primary />
            <Controls />
        </>
    );
};
