import { type FormConfig } from "../generate-command";
import { type GenerateFieldsReturn } from "./generateFields";

type FormValuesConfigTreeNode = {
    config?: GenerateFieldsReturn["formValuesConfig"][0];
    children: FormValuesConfigTree;
};
type FormValuesConfigTree = {
    [key: string]: FormValuesConfigTreeNode;
};

// internal represenstation of formValuesConfig as tree to allow recursive processing
function formValuesConfigToTree(formValuesConfig: GenerateFieldsReturn["formValuesConfig"]): FormValuesConfigTree {
    const treeRoot: FormValuesConfigTreeNode = { children: {} };
    for (const formValueConfig of formValuesConfig) {
        const fieldName = formValueConfig.fieldName;
        let currentTreeNode: FormValuesConfigTreeNode = treeRoot;
        for (const part of fieldName.split(".")) {
            if (!currentTreeNode.children[part]) {
                currentTreeNode.children[part] = { children: {} };
            }
            currentTreeNode = currentTreeNode.children[part];
        }
        currentTreeNode.config = formValueConfig;
    }
    return treeRoot.children;
}

function generateFormValuesTypeFromTree(tree: FormValuesConfigTree, rootType: string): string {
    const omitKeys: string[] = [];
    let appendCode = "";
    for (const [key, value] of Object.entries(tree)) {
        if (Object.keys(value.children).length > 0) {
            const childOmit = generateFormValuesTypeFromTree(value.children, `${rootType}["${key}"]`);
            if (childOmit !== `${rootType}["${key}"]`) {
                appendCode += `${key}: ${childOmit}`;
                omitKeys.push(key);
            }
            if (value.config?.typeCode) {
                throw new Error("Field has both subfields and direct typeCode, which is not supported.");
            }
            if (value.config?.omitFromFragmentType) {
                throw new Error("Field has both subfields and direct omitFromFragmentType, which is not supported.");
            }
        } else if (value.config) {
            if (value.config.typeCode) {
                appendCode += `${key}${value.config.typeCode.nullable ? "?" : ""}: ${value.config.typeCode.type}; `;
            }
            if (value.config.omitFromFragmentType) {
                omitKeys.push(key);
            }
        }
    }

    let code = omitKeys.length ? `Omit<${rootType}, ${omitKeys.map((k) => `"${k}"`).join(" | ")}>` : rootType;
    if (appendCode.length) {
        code += ` & { ${appendCode} }`;
    }
    return code;
}

export function generateFormValuesType({
    formValuesConfig,
    filterByFragmentType,
}: {
    formValuesConfig: GenerateFieldsReturn["formValuesConfig"];
    filterByFragmentType: string;
}) {
    const tree = formValuesConfigToTree(formValuesConfig);
    return `type FormValues = ${generateFormValuesTypeFromTree(tree, filterByFragmentType)};`;
}

function generateInitialValuesFromTree(
    tree: FormValuesConfigTree,
    dataObject: string,
    generationType: "initializationCode" | "defaultInitializationCode",
): string {
    let code = "";
    for (const [key, value] of Object.entries(tree)) {
        if (Object.keys(value.children).length > 0) {
            let childCode = generateInitialValuesFromTree(value.children, `${dataObject}.${key}`, generationType);
            if (childCode.length) {
                if (generationType == "initializationCode") {
                    childCode = `{ ...${dataObject}.${key}, ${childCode} }`;
                    if (value.config?.wrapInitializationCode) {
                        childCode = value.config.wrapInitializationCode.replace("$inner", childCode);
                    }
                    code += `${key}: ${childCode}, `;
                } else {
                    code += `${key}: { ${childCode} }, `;
                }
            }
            if (value.config?.[generationType]) {
                throw new Error("Field has both subfields and direct initialization code, which is not supported.");
            }
        } else if (value.config) {
            if (value.config[generationType]) {
                code += `${key}: ${value.config[generationType]}, `;
            }
        }
    }
    return code;
}

export function generateInitialValues({
    config,
    formValuesConfig,
    filterByFragmentType,
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: Pick<FormConfig<any>, "gqlType" | "mode">;
    formValuesConfig: GenerateFieldsReturn["formValuesConfig"];
    filterByFragmentType: string;
}) {
    const gqlType = config.gqlType;
    const instanceGqlType = gqlType[0].toLowerCase() + gqlType.substring(1);

    const mode = config.mode ?? "all";
    const editMode = mode === "edit" || mode == "all";

    const tree = formValuesConfigToTree(formValuesConfig);
    if (editMode) {
        return `const initialValues = useMemo<Partial<FormValues>>(() => data?.${instanceGqlType}
            ? {
                ...filterByFragment<${filterByFragmentType}>(${instanceGqlType}FormFragment, data.${instanceGqlType}),
                ${generateInitialValuesFromTree(tree, `data.${instanceGqlType}`, "initializationCode")}
            }
            : {
                ${generateInitialValuesFromTree(tree, `data.${instanceGqlType}`, "defaultInitializationCode")}
            }
        , [data]);`;
    } else {
        return `const initialValues = {
            ${generateInitialValuesFromTree(tree, `data.${instanceGqlType}`, "defaultInitializationCode")}
        };`;
    }
}

// TODO this doesn't work for nested fields yet
export function generateDestructFormValueForInput({ formValuesConfig }: { formValuesConfig: GenerateFieldsReturn["formValuesConfig"] }) {
    return formValuesConfig.filter((config) => !!config.destructFromFormValues).length
        ? `{ ${formValuesConfig
              .filter((config) => !!config.destructFromFormValues)
              .map((config) => {
                  if (config.fieldName.includes(".")) {
                      throw new Error("Destructuring from nested form values is not supported yet.");
                  }
                  return config.destructFromFormValues;
              })
              .join(", ")}, ...formValues }`
        : `formValues`;
}

function generateFormValuesToGqlInputFromTree(tree: FormValuesConfigTree, dataObject: string): string {
    let code = "";
    for (const [key, value] of Object.entries(tree)) {
        if (Object.keys(value.children).length > 0) {
            let childCode = generateFormValuesToGqlInputFromTree(value.children, `${dataObject}.${key}`);
            if (childCode.length) {
                childCode = `{ ...${dataObject}.${key}, ${childCode} }`;
                if (value.config?.wrapFormValueToGqlInputCode) {
                    childCode = value.config.wrapFormValueToGqlInputCode.replace("$inner", childCode);
                }
                code += `${key}: ${childCode}, `;
            }
            if (value.config?.formValueToGqlInputCode) {
                throw new Error("Field has both subfields and direct formValueToGqlInputCode, which is not supported.");
            }
        } else if (value.config) {
            if (value.config.formValueToGqlInputCode) {
                code += `${key}: ${value.config.formValueToGqlInputCode}, `;
            }
        }
    }
    return code;
}

export function generateFormValuesToGqlInput({ formValuesConfig }: { formValuesConfig: GenerateFieldsReturn["formValuesConfig"] }) {
    const tree = formValuesConfigToTree(formValuesConfig);
    return `const output = {
        ...formValues,
        ${generateFormValuesToGqlInputFromTree(tree, "formValues")}
    };`;
}
