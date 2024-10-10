import { GridColDef } from "@comet/admin";
import { IconName } from "@comet/admin-icons";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchema } from "@graphql-tools/load";
import { IconProps } from "@mui/material";
import { GridSortDirection } from "@mui/x-data-grid";
import { promises as fs } from "fs";
import { glob } from "glob";
import { introspectionFromSchema } from "graphql";
import { basename, dirname } from "path";

import { FinalFormFileUploadProps } from "../../form/file/FinalFormFileUpload";
import { generateForm } from "./generateForm";
import { generateGrid } from "./generateGrid";
import { GridCombinationColumnConfig } from "./generateGrid/combinationColumn";
import { UsableFields } from "./generateGrid/usableFields";
import { ColumnVisibleOption } from "./utils/columnVisibility";
import { writeGenerated } from "./utils/writeGenerated";

type ImportReference = {
    name: string;
    import: string;
};

type SingleFileFormFieldConfig = { type: "fileUpload"; multiple?: false; maxFiles?: 1 } & Pick<
    Partial<FinalFormFileUploadProps<false>>,
    "maxFileSize" | "readOnly" | "layout" | "accept"
>;

type MultiFileFormFieldConfig = { type: "fileUpload"; multiple: true; maxFiles?: number } & Pick<
    Partial<FinalFormFileUploadProps<true>>,
    "maxFileSize" | "readOnly" | "layout" | "accept"
>;

export type FormFieldConfig<T> = (
    | { type: "text"; multiline?: boolean }
    | { type: "number" }
    | {
          type: "numberRange";
          minValue: number;
          maxValue: number;
          disableSlider?: boolean;
          startAdornment?: string;
          endAdornment?: string;
      }
    | { type: "boolean" }
    | { type: "date" }
    // TODO | { type: "dateTime" }
    | { type: "staticSelect"; values?: Array<{ value: string; label: string } | string>; inputType?: "select" | "radio" }
    | {
          type: "asyncSelect";
          rootQuery: string;
          labelField?: string;
          filterField?: { name: string; gqlName?: string };
      }
    | { type: "block"; block: ImportReference }
    | SingleFileFormFieldConfig
    | MultiFileFormFieldConfig
) & { name: keyof T; label?: string; required?: boolean; virtual?: boolean; validate?: ImportReference; helperText?: string; readOnly?: boolean };
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export function isFormFieldConfig<T>(arg: any): arg is FormFieldConfig<T> {
    return !isFormLayoutConfig(arg);
}

type OptionalNestedFieldsConfig<T> = {
    type: "optionalNestedFields";
    name: keyof T; // object name containing fields
    checkboxLabel?: string;
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    fields: FormFieldConfig<any>[];
};
export type FormLayoutConfig<T> =
    | {
          type: "fieldSet";
          name: string;
          title?: string;
          supportText?: string; // can contain field-placeholder
          collapsible?: boolean; // default true
          initiallyExpanded?: boolean; // default false
          fields: (FormFieldConfig<T> | OptionalNestedFieldsConfig<T>)[];
      }
    | OptionalNestedFieldsConfig<T>;
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export function isFormLayoutConfig<T>(arg: any): arg is FormLayoutConfig<T> {
    return arg.type !== undefined && ["fieldSet", "optionalNestedFields"].includes(arg.type);
}

export type FormConfig<T extends { __typename?: string }> = {
    type: "form";
    gqlType: T["__typename"];
    mode?: "edit" | "add" | "all";
    fragmentName?: string;
    createMutation?: string;
    fields: (FormFieldConfig<T> | FormLayoutConfig<T>)[];
};

export type TabsConfig = { type: "tabs"; tabs: { name: string; content: GeneratorConfig }[] };

export type BaseColumnConfig = Pick<GridColDef, "headerName" | "width" | "minWidth" | "maxWidth" | "flex" | "pinned"> & {
    headerInfoTooltip?: string;
    visible?: ColumnVisibleOption;
};

type IconObject = Pick<IconProps, "color" | "fontSize"> & {
    name: IconName;
};

export type StaticSelectLabelCellContent = {
    primaryText?: string;
    secondaryText?: string;
    icon?: IconName | IconObject | ImportReference;
};

export type GridColumnConfig<T> = (
    | { type: "text" }
    | { type: "number" }
    | { type: "boolean" }
    | { type: "date" }
    | { type: "dateTime" }
    | { type: "staticSelect"; values?: Array<{ value: string; label: string | StaticSelectLabelCellContent } | string> }
    | { type: "block"; block: ImportReference }
) & { name: UsableFields<T> } & BaseColumnConfig;

export type ActionsGridColumnConfig = { type: "actions"; component?: ImportReference } & BaseColumnConfig;

export type GridConfig<T extends { __typename?: string }> = {
    type: "grid";
    gqlType: T["__typename"];
    fragmentName?: string;
    query?: string;
    columns: Array<GridColumnConfig<T> | GridCombinationColumnConfig<UsableFields<T>> | ActionsGridColumnConfig>;
    add?: boolean;
    edit?: boolean;
    delete?: boolean;
    copyPaste?: boolean;
    readOnly?: boolean;
    initialSort?: Array<{ field: string; sort: GridSortDirection }>;
    filterProp?: boolean;
    toolbar?: boolean;
    toolbarActionProp?: boolean;
    rowActionProp?: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GeneratorConfig = FormConfig<any> | GridConfig<any> | TabsConfig;

export type GeneratorReturn = { code: string; gqlDocuments: Record<string, string> };

export async function runFutureGenerate(filePattern = "src/**/*.cometGen.ts") {
    const schema = await loadSchema("./schema.gql", {
        loaders: [new GraphQLFileLoader()],
    });
    const gqlIntrospection = introspectionFromSchema(schema);

    const files: string[] = await glob(filePattern);
    for (const file of files) {
        let outputCode = "";
        let gqlDocumentsOutputCode = "";
        const targetDirectory = `${dirname(file)}/generated`;
        const baseOutputFilename = basename(file).replace(/\.cometGen\.ts$/, "");
        const configs = await import(`${process.cwd()}/${file.replace(/\.ts$/, "")}`);
        //const configs = await import(`${process.cwd()}/${file}`);

        const codeOuputFilename = `${targetDirectory}/${basename(file.replace(/\.cometGen\.ts$/, ""))}.tsx`;
        await fs.rm(codeOuputFilename, { force: true });
        // eslint-disable-next-line no-console
        console.log(`generating ${file}`);

        for (const exportName in configs) {
            const config = configs[exportName] as GeneratorConfig;
            let generated: GeneratorReturn;
            if (config.type == "form") {
                generated = generateForm({ exportName, gqlIntrospection, baseOutputFilename, targetDirectory }, config);
            } else if (config.type == "grid") {
                generated = generateGrid({ exportName, gqlIntrospection, baseOutputFilename, targetDirectory }, config);
            } else {
                throw new Error(`Unknown config type: ${config.type}`);
            }
            outputCode += generated.code;
            for (const queryName in generated.gqlDocuments) {
                gqlDocumentsOutputCode += `export const ${queryName} = gql\`${generated.gqlDocuments[queryName]}\`\n`;
            }
        }

        await writeGenerated(codeOuputFilename, outputCode);

        if (gqlDocumentsOutputCode != "") {
            const gqlDocumentsOuputFilename = `${targetDirectory}/${basename(file.replace(/\.cometGen\.ts$/, ""))}.gql.tsx`;
            await fs.rm(gqlDocumentsOuputFilename, { force: true });
            gqlDocumentsOutputCode = `import { gql } from "@apollo/client";
                import { finalFormFileUploadFragment } from "@comet/cms-admin";

                ${gqlDocumentsOutputCode}
            `;
            await writeGenerated(gqlDocumentsOuputFilename, gqlDocumentsOutputCode);
        }
    }
}
