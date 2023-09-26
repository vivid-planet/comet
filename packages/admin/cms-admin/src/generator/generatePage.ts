import { IntrospectionQuery } from "graphql";

import { CrudGeneratorConfig } from "./types";
import { buildNameVariants } from "./utils/buildNameVariants";
import { camelCaseToHumanReadable } from "./utils/camelCaseToHumanReadable";
import { writeGenerated } from "./utils/writeGenerated";

export async function writeCrudPage({ entityName, target: targetDirectory }: CrudGeneratorConfig, schema: IntrospectionQuery): Promise<void> {
    const { classNamePlural, classNameSingular, instanceNamePlural } = buildNameVariants(entityName);
    const out = `
        import { Stack, StackPage, StackSwitch } from "@comet/admin";
        import * as React from "react";
        import { useIntl } from "react-intl";
        import { ${entityName}Form } from "./${entityName}Form";
        import { ${classNamePlural}Grid } from "./${classNamePlural}Grid";

        export function ${classNamePlural}Page(): React.ReactElement {
            const intl = useIntl();
            return (
                <Stack topLevelTitle={intl.formatMessage({ id: "${instanceNamePlural}.${instanceNamePlural}", defaultMessage: "${camelCaseToHumanReadable(
        classNamePlural,
    )}" })}>
                    <StackSwitch>
                        <StackPage name="grid">
                            <${classNamePlural}Grid />
                        </StackPage>
                        <StackPage name="edit" title={intl.formatMessage({ id: "${instanceNamePlural}.edit${classNameSingular}", defaultMessage: "Edit ${camelCaseToHumanReadable(
        classNameSingular,
    )}" })}>
                            {(selectedId) => <${entityName}Form id={selectedId} />}
                        </StackPage>
                        <StackPage name="add" title={intl.formatMessage({ id: "${instanceNamePlural}.add${classNameSingular}", defaultMessage: "Add ${camelCaseToHumanReadable(
        classNameSingular,
    )}" })}>
                            <${entityName}Form />
                        </StackPage>
                    </StackSwitch>
                </Stack>
            );
        }
    `;
    await writeGenerated(`${targetDirectory}/${classNamePlural}Page.tsx`, out);
}
