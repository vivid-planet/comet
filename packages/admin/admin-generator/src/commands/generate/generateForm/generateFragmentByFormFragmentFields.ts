import { generateGqlQueryTreeFromFields } from "../utils/generateGqlOperation";

/**
 * Helper function that generates a GraphQL fragment from form fragment fields (array of dot.separated.fields).
 *
 * - Fragments are supported as "foo...FragmentName"
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
    let fragmentCode = `
        fragment ${formFragmentName} on ${gqlType} {
            ${generateGqlQueryTreeFromFields(formFragmentFields)}
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
