import { createCometTheme } from "@comet/admin-theme";
import BrowserOnly from "@docusaurus/BrowserOnly";
import CodeBlock from "@theme/CodeBlock";
import type { Props as PlaygroundProps } from "@theme/Playground";
import React from "react";
import { transform } from "sucrase";

interface StoryProps extends Omit<PlaygroundProps, "children"> {
    path: string;
}

const importStory = async (name: string) => {
    const { default: code } = await import(`!!raw-loader!../stories/${name}`);
    return code;
};

export const Story = ({ path, ...props }: StoryProps) => {
    const theme = createCometTheme();
    const [code, setCode] = React.useState("");

    React.useEffect(() => {
        importStory(path).then(setCode);
    }, [path]);

    return (
        <BrowserOnly>
            {() => {
                // https://docusaurus.io/docs/docusaurus-core/#browseronly
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const { MuiThemeProvider } = require("@comet/admin");

                return (
                    <MuiThemeProvider theme={theme}>
                        <CodeBlock
                            language="tsx"
                            live
                            transformCode={(code) => {
                                const compiledCode = transform(code, {
                                    transforms: ["typescript", "jsx"],
                                    jsxRuntime: "preserve",
                                }).code;
                                const codeWithoutImportsAndExports = compiledCode.replace(/import.*\n/g, "").replace(/export.*/g, "");
                                return codeWithoutImportsAndExports;
                            }}
                            {...props}
                        >
                            {code}
                        </CodeBlock>
                    </MuiThemeProvider>
                );
            }}
        </BrowserOnly>
    );
};
