import { Controls, Description, type Of, Primary, Stories } from "@storybook/addon-docs/blocks";

type DocsPageProps = {
    defaultStory: Of;
};

export const DocsPage = ({ defaultStory }: DocsPageProps) => {
    return (
        <>
            <Description of={defaultStory} />
            <Primary />
            <Controls />
            <Stories title="" includePrimary={false} />
        </>
    );
};
