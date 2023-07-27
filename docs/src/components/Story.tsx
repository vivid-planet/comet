import { MuiThemeProvider } from "@comet/admin";
import { createCometTheme } from "@comet/admin-theme";
import CodeBlock from "@theme/CodeBlock";
import type { Props as PlaygroundProps } from "@theme/Playground";
import React, { PropsWithChildren } from "react";
import { transform } from "sucrase";

export const Story = ({ children, ...props }: PropsWithChildren<PlaygroundProps>) => {
    const theme = createCometTheme();

    return (
        <MuiThemeProvider theme={theme}>
            <CodeBlock
                language="tsx"
                live
                transformCode={(code) => {
                    const compiledCode = transform(code, { transforms: ["typescript", "jsx"], jsxRuntime: "preserve" }).code;
                    const codeWithoutImports = compiledCode.replace(/import.*\n/g, "");
                    return codeWithoutImports;
                }}
                {...props}
            >
                {children}
            </CodeBlock>
        </MuiThemeProvider>
    );
};
