// @ts-ignore
import React from 'react';
import { SyntaxHighlighter } from 'storybook/internal/components';

const EXAMPLE_CONFIG = `export const SampleGrid = {
    type: "grid",
    gqlType: "Sample",
    columns: [{ type: "text", name: "sample" }]
};`;

const EXAMPLE_STORY = `import type { Meta, StoryFn } from "@storybook/react-webpack5";

const config = {
    component: YourComponent,
    title: "Your Story"
};
export default config;

export const YourStory = {
    parameters: {
        adminGeneratorConfig: "./YourComponent.cometGen.ts"
    }
};`;

export const NoConfigHelp: React.FC = () => {
    return (
        <div style={{ padding: '20px' }}>
            <h2>Admin Generator Config</h2>
            <p>No config file specified for this story. To use this addon:</p>

            <h3>1. Create a config file</h3>
            <p>Create a TypeScript file next to your story (e.g., YourComponent.cometGen.ts):</p>
            <SyntaxHighlighter language="typescript" copyable={true}>
                {EXAMPLE_CONFIG}
            </SyntaxHighlighter>

            <h3>2. Configure your story</h3>
            <p>Add the adminGeneratorConfig parameter to your story:</p>
            <SyntaxHighlighter language="typescript" copyable={true}>
                {EXAMPLE_STORY}
            </SyntaxHighlighter>

            <h3>3. View the config</h3>
            <p>Once configured, this panel will display the contents of your config file with syntax highlighting.</p>
        </div>
    );
};
