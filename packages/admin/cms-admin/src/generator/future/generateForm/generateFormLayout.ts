import { FormConfig, FormLayoutConfig } from "../generator";
import { Imports } from "../utils/generateImportsCode";

export function generateFormLayout(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: FormLayoutConfig<any>,
    fieldsCode: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formConfig: FormConfig<any>,
) {
    const gqlType = formConfig.gqlType;
    const instanceGqlType = gqlType[0].toLowerCase() + gqlType.substring(1);

    const imports: Imports = [];
    let code = "";
    const formFragmentFields: string[] = [];

    if (config.type === "fieldSet") {
        imports.push({ name: "FieldSet", importPath: "@comet/admin" });
        const supportPlaceholder = config.supportText?.includes("{");
        if (supportPlaceholder) {
            imports.push({ name: "FormSpy", importPath: "react-final-form" });
        }
        code = `
        <FieldSet
            ${config.collapsible ? `collapsible` : ``}
            ${config.initiallyExpanded ? `initiallyExpanded` : ``}
            title={<FormattedMessage id="${instanceGqlType}.${config.title.replace(/ /g, "")}.title" defaultMessage="${config.title}" />}
            ${
                config.supportText
                    ? `supportText={
                        ${supportPlaceholder ? `mode === "edit" && (<FormSpy subscription={{ values: true }}>{({ values }) => (` : ``}
                        <FormattedMessage
                            id="${instanceGqlType}.${config.title.replace(/ /g, "")}.supportText"
                            defaultMessage="${config.supportText}"
                            ${supportPlaceholder ? `values={{ ...values }}` : ``}
                        />
                        ${supportPlaceholder ? `)}</FormSpy>)` : ``}
                    }`
                    : ``
            }
        >
            ${fieldsCode}
        </FieldSet>`;
    } else {
        throw new Error(`Unsupported type`);
    }
    return {
        code,
        imports,
        formFragmentFields,
    };
}
