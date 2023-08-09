import { createCometTheme } from "@comet/admin-theme";
import BrowserOnly from "@docusaurus/BrowserOnly";
import CodeBlock from "@theme/CodeBlock";
import type { Props as PlaygroundProps } from "@theme/Playground";
import React, { PropsWithChildren } from "react";
import { transform } from "sucrase";

export const Story = ({ children, ...props }: PropsWithChildren<PlaygroundProps>) => {
    const theme = createCometTheme();

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
                            {children}
                        </CodeBlock>
                    </MuiThemeProvider>
                );
            }}
        </BrowserOnly>
    );
};
