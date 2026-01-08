import { type Adornment, type FormConfig, type FormFieldConfig } from "../../generate-command.js";
import { camelCaseToHumanReadable } from "../../utils/camelCaseToHumanReadable.js";
import { convertConfigImport } from "../../utils/convertConfigImport.js";
import { type Imports } from "../../utils/generateImportsCode.js";
import { generateFormattedMessage } from "../../utils/intl.js";
import { isGeneratorConfigImport } from "../../utils/runtimeTypeGuards.js";

type AdornmentData = {
    adornmentString: string;
    adornmentImport?: { name: string; importPath: string };
};

const buildAdornmentData = ({ adornmentData }: { adornmentData: Adornment }): AdornmentData => {
    let adornmentString = "";
    let adornmentImport = { name: "", importPath: "" };

    if (typeof adornmentData === "string") {
        return { adornmentString: adornmentData };
    }

    if (typeof adornmentData.icon === "string") {
        adornmentString = `<${adornmentData.icon}Icon />`;
        adornmentImport = {
            name: `${adornmentData.icon} as ${adornmentData.icon}Icon`,
            importPath: "@comet/admin-icons",
        };
    } else if (typeof adornmentData.icon === "object") {
        if (isGeneratorConfigImport(adornmentData.icon)) {
            adornmentString = `<${adornmentData.icon.name} />`;
            adornmentImport = convertConfigImport(adornmentData.icon);
        } else {
            const { name, ...iconProps } = adornmentData.icon;
            adornmentString = `<${name}Icon
                ${Object.entries(iconProps)
                    .map(([key, value]) => `${key}="${value}"`)
                    .join("\n")}
            />`;
            adornmentImport = {
                name: `${adornmentData.icon.name} as ${adornmentData.icon.name}Icon`,
                importPath: "@comet/admin-icons",
            };
        }
    }

    return { adornmentString, adornmentImport };
};

/**
 * Helper function that builds various options needed for generating form fields.
 */
export function buildFormFieldOptions({
    config,
    formConfig,
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: FormFieldConfig<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formConfig: FormConfig<any>;
}) {
    const rootGqlType = formConfig.gqlType;
    const name = String(config.name);
    const formattedMessageRootId = rootGqlType[0].toLowerCase() + rootGqlType.substring(1);
    const fieldLabel = generateFormattedMessage({
        config: config.label,
        id: `${formattedMessageRootId}.${name}`,
        defaultMessage: camelCaseToHumanReadable(name),
        type: "jsx",
    });

    const imports: Imports = [];
    let startAdornment: AdornmentData = { adornmentString: "" };
    let endAdornment: AdornmentData = { adornmentString: "" };

    if ("startAdornment" in config && config.startAdornment) {
        startAdornment = buildAdornmentData({
            adornmentData: config.startAdornment,
        });
        if (startAdornment.adornmentImport) {
            imports.push(startAdornment.adornmentImport);
        }
    }

    if ("endAdornment" in config && config.endAdornment) {
        endAdornment = buildAdornmentData({
            adornmentData: config.endAdornment,
        });
        if (endAdornment.adornmentImport) {
            imports.push(endAdornment.adornmentImport);
        }
    }

    return { name, formattedMessageRootId, fieldLabel, startAdornment, endAdornment, imports };
}
