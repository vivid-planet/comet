import objectPath from "object-path";

/**
 * Helper function that generates a GraphQL fragment from form fragment fields (array of dot.separated.fields).
 *
 * - Fragments are supported as "foo { ...FragmentName }"
 * - for FinalFormFileUpload and FinalFormFileUploadDownloadable the needed variable is added automatically
 */
export function generateFragmentByFormFragmentFields({
    formFragmentName,
    gqlType,
    formFragmentFields,
}: {
    formFragmentName: string;
    gqlType: string;
    formFragmentFields: string[];
}): string {
    type FieldsObjectType = { [key: string]: FieldsObjectType | boolean | string };

    // 1. create tree out of dot separated fields
    const fieldsObject = formFragmentFields.reduce<FieldsObjectType>((acc, field) => {
        const fragmentMatch = field.match(/(.*)({.*?})/); // keep { ... } parts as they are, contains eg. fragments
        if (fragmentMatch) {
            objectPath.set(acc, fragmentMatch[1].trim(), fragmentMatch[2]);
        } else {
            objectPath.set(acc, field, true);
        }
        return acc;
    }, {});

    // 2. create fragment string out of tree
    const recursiveStringify = (obj: FieldsObjectType): string => {
        let ret = "";
        let prefixField = "";
        for (const key in obj) {
            const value = obj[key];
            if (typeof value === "boolean") {
                ret += `${prefixField}${key}`;
            } else if (typeof value === "string") {
                ret += `${prefixField}${key} ${value}`;
            } else {
                ret += `${prefixField}${key} { ${recursiveStringify(value)} }`;
            }
            prefixField = " ";
        }
        return ret;
    };
    let fragmentCode = `
        fragment ${formFragmentName} on ${gqlType} {
            ${recursiveStringify(fieldsObject)}
        }
    `;

    // 3. add fragment instance variables when fragments are used
    // this only works for hardcoded special cases, and the imports are also not handled here - if there would be more, this needs improvement
    const fragments = {
        "...FinalFormFileUpload": "${finalFormFileUploadFragment}",
        "...FinalFormFileUploadDownloadable": "${finalFormFileUploadDownloadableFragment}",
    };
    for (const [fragmentName, fragmentVar] of Object.entries(fragments)) {
        if (fragmentCode.match(`${fragmentName.replace(".", "\\.")}\\b`) && !fragmentCode.includes(fragmentVar)) {
            fragmentCode += `\n${fragmentVar}`;
        }
    }
    return fragmentCode;
}
