import { RuleTester } from "eslint";

import noPrivateSiblingImport from "./no-private-sibling-import";

const ruleTester = new RuleTester();

const errors = [{ message: "Avoid private sibling import from other files" }];

const options = [["gql", "sc", "gql.generated"]];

ruleTester.run("no-private-sibling-import", noPrivateSiblingImport, {
    valid: [{ code: `import FooGql from "./Foo.gql";`, filename: "/path/to/Foo.ts", options }],
    invalid: [{ code: `import BarGql from "./Bar.gql";`, filename: "/path/to/Foo.ts", options, errors }],
});

ruleTester.run("no-private-sibling-import", noPrivateSiblingImport, {
    valid: [{ code: `import FooGql from "./Foo.gql.generated";`, filename: "/path/to/Foo.ts", options }],
    invalid: [{ code: `import BarGql from "./Bar.gql.generated";`, filename: "/path/to/Foo.ts", options, errors }],
});
