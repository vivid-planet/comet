import { RuleTester } from "eslint";

import noCometLibImport from "./no-comet-lib-import";

const ruleTester = new RuleTester();

ruleTester.run("no-comet-lib-import", noCometLibImport, {
    valid: [
        // Regular @comet imports without /lib are allowed
        { code: `import { Foo } from "@comet/cms-admin";` },
        { code: `import { Bar } from "@comet/admin";` },
        { code: `import Baz from "@comet/cms-api";` },

        // Subpath imports without /lib are allowed
        { code: `import { Foo } from "@comet/cms-admin/components";` },
        { code: `import { Bar } from "@comet/admin/utils/helper";` },

        // Non-@comet packages with /lib are allowed
        { code: `import { something } from "other-package/lib/utils";` },
        { code: `import lib from "some-lib";` },

        // Relative imports are allowed
        { code: `import { Foo } from "./lib/something";` },
        { code: `import { Bar } from "../lib/utils";` },
    ],
    invalid: [
        // Direct /lib imports should be forbidden
        {
            code: `import { Foo } from "@comet/cms-admin/lib";`,
            errors: [{ message: `Do not import from /lib of @comet packages. Import from "@comet/cms-admin" instead.` }],
            output: `import { Foo } from "@comet/cms-admin";`,
        },
        {
            code: `import { Bar } from "@comet/admin/lib";`,
            errors: [{ message: `Do not import from /lib of @comet packages. Import from "@comet/admin" instead.` }],
            output: `import { Bar } from "@comet/admin";`,
        },

        // /lib with subpath should be forbidden
        {
            code: `import { Foo } from "@comet/cms-admin/lib/components";`,
            errors: [{ message: `Do not import from /lib of @comet packages. Import from "@comet/cms-admin/components" instead.` }],
            output: `import { Foo } from "@comet/cms-admin/components";`,
        },
        {
            code: `import { Bar } from "@comet/admin/lib/utils/helper";`,
            errors: [{ message: `Do not import from /lib of @comet packages. Import from "@comet/admin/utils/helper" instead.` }],
            output: `import { Bar } from "@comet/admin/utils/helper";`,
        },

        // Default imports with /lib should also be forbidden
        {
            code: `import Baz from "@comet/cms-api/lib/something";`,
            errors: [{ message: `Do not import from /lib of @comet packages. Import from "@comet/cms-api/something" instead.` }],
            output: `import Baz from "@comet/cms-api/something";`,
        },

        // Various @comet packages
        {
            code: `import { createContext } from "@comet/eslint-config/lib/core";`,
            errors: [{ message: `Do not import from /lib of @comet packages. Import from "@comet/eslint-config/core" instead.` }],
            output: `import { createContext } from "@comet/eslint-config/core";`,
        },
    ],
});
