import { CrudGeneratorConfig } from "@comet/cms-admin";

export default [
    {
        target: "src/products/generated",
        entityName: "Product",
    },
    {
        target: "src/warnings/generated",
        entityName: "Warning",
    },
] satisfies CrudGeneratorConfig[];
