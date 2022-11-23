import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    schema: "schema.gql",
    documents: ["src/**/*.{ts,tsx}", "preBuild/src/**/*.{ts,tsx}"],
    generates: {
        "./src/graphql.generated.ts": {
            plugins: ["named-operations-object", "typescript", "typescript-operations"],
            config: {
                avoidOptionals: {
                    field: true,
                },
                enumsAsTypes: true,
                namingConvention: "keep",
                typesPrefix: "GQL",
            },
        },
    },
};

export default config;
