import CodeBlock from "@theme/CodeBlock";
import type { Props as PlaygroundProps } from "@theme/Playground";
import React, { PropsWithChildren } from "react";
import { transform } from "sucrase";

export const LiveCodeBlock = ({ children, ...props }: PropsWithChildren<PlaygroundProps>) => {
    return (
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
    );
};
