import { type FormConfig } from "../generate-command";
import { flatFormFieldsFromFormConfig } from "./flatFormFieldsFromFormConfig";
import { type GenerateFieldsReturn } from "./generateFields";

export function generateFormValuesType({
    config,
    formValuesConfig,
    filterByFragmentType,
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: FormConfig<any>;
    formValuesConfig: GenerateFieldsReturn["formValuesConfig"];
    filterByFragmentType: string;
}) {
    const formFields = flatFormFieldsFromFormConfig(config);
    const rootBlockFields = formFields
        .filter((field) => field.type == "block")
        .map((field) => {
            // map is for ts to infer block type correctly
            if (field.type !== "block") throw new Error("Field is not a block field");
            return field;
        });
    return `type FormValues = ${
        formValuesConfig.filter((config) => !!config.omitFromFragmentType).length > 0 || rootBlockFields.length > 0
            ? `Omit<${filterByFragmentType}, ${[
                  ...(rootBlockFields.length > 0 ? ["keyof typeof rootBlocks"] : []),
                  ...formValuesConfig.filter((config) => !!config.omitFromFragmentType).map((config) => `"${config.omitFromFragmentType}"`),
              ].join(" | ")}>`
            : `${filterByFragmentType}`
    } ${
        formValuesConfig.filter((config) => !!config.typeCode).length > 0
            ? `& {
                ${formValuesConfig
                    .filter((config) => !!config.typeCode)
                    .map((config) => config.typeCode)
                    .join("\n")}
            }`
            : ""
    };`;
}

export function generateInitialValues({
    config,
    formValuesConfig,
    filterByFragmentType,
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: FormConfig<any>;
    formValuesConfig: GenerateFieldsReturn["formValuesConfig"];
    filterByFragmentType: string;
}) {
    const gqlType = config.gqlType;
    const instanceGqlType = gqlType[0].toLowerCase() + gqlType.substring(1);

    const mode = config.mode ?? "all";
    const editMode = mode === "edit" || mode == "all";

    if (editMode) {
        return `const initialValues = useMemo<Partial<FormValues>>(() => data?.${instanceGqlType}
            ? {
                ...filterByFragment<${filterByFragmentType}>(${instanceGqlType}FormFragment, data.${instanceGqlType}),
                ${formValuesConfig
                    .filter((config) => !!config.initializationCode)
                    .map((config) => config.initializationCode)
                    .join(",\n")}
            }
            : {
                ${formValuesConfig
                    .filter((config) => !!config.defaultInitializationCode)
                    .map((config) => config.defaultInitializationCode)
                    .join(",\n")}
            }
        , [data]);`;
    } else {
        return `const initialValues = {
            ${formValuesConfig
                .filter((config) => !!config.defaultInitializationCode)
                .map((config) => config.defaultInitializationCode)
                .join(",\n")}
        };`;
    }
}

export function generateDestructFormValueForInput({ formValuesConfig }: { formValuesConfig: GenerateFieldsReturn["formValuesConfig"] }) {
    return formValuesConfig.filter((config) => !!config.destructFromFormValues).length
        ? `{ ${formValuesConfig
              .filter((config) => !!config.destructFromFormValues)
              .map((config) => config.destructFromFormValues)
              .join(", ")}, ...formValues }`
        : `formValues`;
}

export function generateFormValuesToGqlInput({ generatedFields }: { generatedFields: GenerateFieldsReturn }) {
    return `const output = {
        ...formValues,
        ${generatedFields.formValueToGqlInputCode}
    };`;
}
