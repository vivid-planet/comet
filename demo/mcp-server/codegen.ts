import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    schema: "schema.gql",
    generates: {
        "./src/graphql.generated.ts": {
            plugins: ["typescript"],
            config: {
                avoidOptionals: {
                    field: true,
                },
                enumsAsTypes: true,
                namingConvention: "keep",
                scalars: {
                    DateTime: "string",
                    Date: "string",
                    LocalDate: "string",
                    JSON: "unknown",
                    JSONObject: "Record<string, unknown>",
                },
                typesPrefix: "GQL",
            },
        },
        "./src/": {
            documents: ["./src/**/!(*.generated).{tsx,ts}"],
            preset: "near-operation-file",
            presetConfig: {
                extension: ".generated.ts",
                baseTypesPath: "graphql.generated.ts",
            },
            config: {
                avoidOptionals: {
                    field: true,
                },
                enumsAsTypes: true,
                namingConvention: "keep",
                scalars: {
                    DateTime: "string",
                    Date: "string",
                    LocalDate: "string",
                    JSON: "unknown",
                    JSONObject: "Record<string, unknown>",
                },
                typesPrefix: "GQL",
            },
            plugins: ["typescript-operations"],
        },
    },
    ignoreNoDocuments: true,
};

export default config;
