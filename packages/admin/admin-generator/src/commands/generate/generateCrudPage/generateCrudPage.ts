import { camelCase, capitalCase, pascalCase } from "change-case";
import { plural } from "pluralize";
import { type ComponentType } from "react";

import { type CrudPageConfig, type CrudPageFormConfig, type GeneratorReturn } from "../generate-command";
import { convertConfigImport } from "../utils/convertConfigImport";
import { getFormattedMessageString } from "../utils/intl";
import { isGeneratorConfigImport } from "../utils/runtimeTypeGuards";
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

    const addImport = (value: ComponentType) => {
        if (!isGeneratorConfigImport(value)) {
            throw new Error("value must be a GeneratorConfigImport");
        }

        const { name, importPath } = convertConfigImport(value);

        if (imports[importPath]) {
            if (!imports[importPath].includes(name)) {
                imports[importPath].push(name);
            }
        } else {
            imports[importPath] = [name];
        }
    };

    const hasMultiplePagesToRender = Boolean(isGeneratorConfigImport(addFormConfig.component) || isGeneratorConfigImport(editFormConfig.component));

    const pagesCodetoRender: string[] = [];

    if (isGeneratorConfigImport(gridConfig.component)) {
        addImport(gridConfig.component);
        pagesCodetoRender.push(generateGridPageCode({ component: gridConfig.component, renderInsideStackPage: hasMultiplePagesToRender }));
    }

    if (isGeneratorConfigImport(addFormConfig.component)) {
        addImport(addFormConfig.component);
        pagesCodetoRender.push(
            generateFormPageCode({
                component: addFormConfig.component,
                type: "add",
                titleMessage: getFormattedMessageString(
                    `${rootMessageId}.addPageTitle`,
                    addFormConfig.pageTitle ?? `Add ${capitalCase(config.gqlType)}`,
                ),
            }),
        );
    }

    if (isGeneratorConfigImport(editFormConfig.component)) {
        addImport(editFormConfig.component);
        pagesCodetoRender.push(
            generateFormPageCode({
                component: editFormConfig.component,
                type: "edit",
                titleMessage: getFormattedMessageString(
                    `${rootMessageId}.editPageTitle`,
                    editFormConfig.pageTitle ?? `Edit ${capitalCase(config.gqlType)}`,
                ),
            }),
        );
    }

    const pagesCodeToRenderString = hasMultiplePagesToRender
        ? `
            <StackSwitch>${pagesCodetoRender.join("")}</StackSwitch>
        `
        : `<>${pagesCodetoRender.join("")}</>`;

    const code = `
        ${Object.entries(imports)
            .map(([key, imports]) => `import { ${imports.join(", ")} } from "${key}";`)
            .join("\n")}

        ${addFormConfig.component || editFormConfig.component ? formToolbarCode : ""}

        export function ${componentName}() {
            const intl = useIntl();

            return (
                <Stack topLevelTitle={${getFormattedMessageString(`${rootMessageId}.topLevelTitle`, topLevelTitle)}}>
                    ${pagesCodeToRenderString}
                </Stack>
            );
        }
    `;

    return {
        code,
        gqlDocuments: {},
    };
}
