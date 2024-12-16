import { CrudGeneratorConfig } from "@comet/cms-admin";

export default [
    {
        target: "src/products/generated",
        entityName: "Product",
    },
] satisfies CrudGeneratorConfig[];
