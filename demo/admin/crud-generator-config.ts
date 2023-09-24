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
    {
        target: "src/books/generated",
        entityName: "Book",
        // if your entity expects block JSON for some props, you might need to explicitly define rootBlocks
        // that's not necessary if the used block is defined
        //   - in src/common/blocks and conforms to our naming conventions
        //   - in a blocks folder right next to the generated folder and conforms to our naming conventions
        //   - in @comet/cms-admin or @comet/blocks-admin
        //
        // the definition looks like this:
        // rootBlocks: {
        //     prop: { name: "ExampleBlock", import: "path/or/npm/package" },
        // },
    },
] satisfies CrudGeneratorConfig[];
