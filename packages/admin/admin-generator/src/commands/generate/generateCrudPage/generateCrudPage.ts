import { camelCase, capitalCase, pascalCase } from "change-case";
import { plural } from "pluralize";

import { type CrudPageConfig, type CrudPageFormConfig, type GeneratorReturn } from "../generate-command";
import { getFormattedMessageString } from "../utils/intl";
import { formToolbarCode } from "./formToolbarCode";
import { generateFormPageCode } from "./generateFormPageCode";
import { generateGridPageCode } from "./generateGridPageCode";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function generateCrudPage(config: CrudPageConfig<any>): GeneratorReturn {
    const gqlTypePlural = plural(config.gqlType);
    const componentName = pascalCase(`${gqlTypePlural}Page`);
    const topLevelTitle = config.topLevelTitle ?? capitalCase(gqlTypePlural);

    const rootMessageId = `${camelCase(gqlTypePlural)}`;

    const gridConfig = config.grid;

    const addFormConfig: Partial<CrudPageFormConfig> = {
        ...config.forms,
        ...config.addForm,
    };

    const editFormConfig: Partial<CrudPageFormConfig> = {
        ...config.forms,
        ...config.editForm,
    };

    const imports: Record<string, string[]> = {
        "react-intl": ["useIntl"],
        "@comet/admin": [
            "FillSpace",
            "SaveBoundary",
            "SaveBoundarySaveButton",
            "Stack",
            "StackMainContent",
            "StackPage",
            "StackSwitch",
            "StackToolbar",
            "ToolbarActions",
            "ToolbarAutomaticTitleItem",
            "ToolbarBackButton",
        ],
        "@comet/cms-admin": ["ContentScopeIndicator"],
    };

    const addImport = (value: string, from: string) => {
        if (imports[from]) {
            if (!imports[from].includes(value)) {
                imports[from].push(value);
            }
        } else {
            imports[from] = [value];
        }
    };

    const hasMultiplePagesToRender = Boolean(addFormConfig.import || editFormConfig.import);

    const pagesCodetoRender: string[] = [
        generateGridPageCode({ importName: gridConfig.import.name, renderInsideStackPage: hasMultiplePagesToRender }),
    ];

    addImport(gridConfig.import.name, gridConfig.import.import);

    if (addFormConfig.import) {
        addImport(addFormConfig.import.name, addFormConfig.import.import);
        pagesCodetoRender.push(
            generateFormPageCode({
                importName: addFormConfig.import.name,
                type: "add",
                titleMessage: getFormattedMessageString(
                    `${rootMessageId}.addPageTitle`,
                    addFormConfig.pageTitle ?? `Add ${capitalCase(config.gqlType)}`,
                ),
            }),
        );
    }

    if (editFormConfig.import) {
        addImport(editFormConfig.import.name, editFormConfig.import.import);
        pagesCodetoRender.push(
            generateFormPageCode({
                importName: editFormConfig.import.name,
                type: "edit",
                // TODO: Allow using a row-value for the title, e.g. `row.name`
                titleMessage: getFormattedMessageString(
                    `${rootMessageId}.editPageTitle`,
                    editFormConfig.pageTitle ?? `Edit ${capitalCase(config.gqlType)}`,
                ),
            }),
        );
    }

    const pagesCodetoRenderString = hasMultiplePagesToRender
        ? `
            <StackSwitch>${pagesCodetoRender.join("")}</StackSwitch>
        `
        : `<>${pagesCodetoRender.join("")}</>`;

    const code = `
        ${Object.entries(imports)
            .map(([key, imports]) => `import { ${imports.join(", ")} } from "${key}";`)
            .join("\n")}

        ${addFormConfig.import || editFormConfig.import ? formToolbarCode : ""}

        export function ${componentName}() {
            const intl = useIntl();

            return (
                <Stack topLevelTitle={${getFormattedMessageString(`${rootMessageId}.topLevelTitle`, topLevelTitle)}}>
                    ${pagesCodetoRenderString}
                </Stack>
            );
        }
    `;

    return {
        code,
        gqlDocuments: {},
    };
}
