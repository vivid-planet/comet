import { CrudGeneratorConfig } from "@comet/cms-admin";
export default [
    {
        target: "src/products/generated",
        entityName: "Product",
    },
    {
        target: "src/news/generated",
        entityName: "News",
    },
] satisfies CrudGeneratorConfig[];
