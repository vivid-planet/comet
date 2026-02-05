import { RuleTester } from "eslint";

import noCometLibImport from "./no-comet-lib-import";

const ruleTester = new RuleTester();

ruleTester.run("no-comet-lib-import", noCometLibImport, {
    valid: [
        { code: "import { Button } from '@comet/admin';" },
        { code: "import { utils } from '@comet/admin/utils';" },
        { code: "import { helper } from '@comet/cms-admin/helpers';" },
        { code: "import something from '@other/lib';" },
    ],
    invalid: [
        {
            code: "import { Button } from '@comet/admin/lib';",
            errors: [{ message: "Avoid importing from @comet packages via /lib. Use the package root instead." }],
        },
        {
            code: "import { Button } from '@comet/admin/lib/components';",
            errors: [{ message: "Avoid importing from @comet packages via /lib. Use the package root instead." }],
        },
    ],
});
