import BrowserOnly from "@docusaurus/BrowserOnly";
import CodeBlock from "@theme/CodeBlock";
import type { Props as PlaygroundProps } from "@theme/Playground";
import { useEffect, useState } from "react";
import { IntlProvider } from "react-intl";
import { transform } from "sucrase";

interface StoryProps extends Omit<PlaygroundProps, "children"> {
    path: string;
}

const importStory = async (name: string) => {
    const { default: code } = await import(`!!raw-loader!../stories/${name}`);
    return code;
};

export const Story = ({ path, ...props }: StoryProps) => {
    const [code, setCode] = useState("");

    useEffect(() => {
        importStory(path).then(setCode);
    }, [path]);

    return (
        <BrowserOnly>
            {() => {
                // https://docusaurus.io/docs/docusaurus-core/#browseronly

                // eslint-disable-next-line @typescript-eslint/no-require-imports
                const { createCometTheme, MuiThemeProvider } = require("@comet/admin");

                const theme = createCometTheme();

                return (
                    <IntlProvider locale="en">
                        <MuiThemeProvider theme={theme}>
                            <CodeBlock
                                language="tsx"
                                // @ts-expect-error live prop is missing in the types
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
                    </IntlProvider>
                );
            }}
        </BrowserOnly>
    );
};
