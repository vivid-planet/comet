/* eslint-disable @typescript-eslint/no-explicit-any */
import { type GridColDef } from "@comet/admin";
import { type IconName } from "@comet/admin-icons";
import { type BlockInterface, type FinalFormFileUploadProps } from "@comet/cms-admin";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchema } from "@graphql-tools/load";
import { type IconProps } from "@mui/material";
import {
    type GridCellParams,
    type GridFilterItem,
    type GridFilterOperator,
    type GridRenderCellParams,
    type GridSortDirection,
    type GridValidRowModel,
} from "@mui/x-data-grid";
import { Command } from "commander";
import { type FieldValidator } from "final-form";
import { promises as fs } from "fs";
import { glob } from "glob";
import { introspectionFromSchema } from "graphql";
import { basename, dirname } from "path";
import { type ComponentType } from "react";

import { generateForm } from "./generateForm/generateForm";
import { type GridCombinationColumnConfig } from "./generateGrid/combinationColumn";
import { generateGrid } from "./generateGrid/generateGrid";
import { type UsableFields } from "./generateGrid/usableFields";
import { type ColumnVisibleOption } from "./utils/columnVisibility";
import { configsFromSourceFile, morphTsSource } from "./utils/tsMorphHelper";
import { writeGenerated } from "./utils/writeGenerated";

type IconObject = Pick<IconProps, "color" | "fontSize"> & {
    name: IconName;
};

type Icon = IconName | IconObject | ComponentType;
export type Adornment = string | { icon: Icon };

type SingleFileFormFieldConfig = { type: "fileUpload"; multiple?: false; maxFiles?: 1; download?: boolean } & Pick<
    Partial<FinalFormFileUploadProps<false>>,
    "maxFileSize" | "readOnly" | "layout" | "accept"
>;

type MultiFileFormFieldConfig = { type: "fileUpload"; multiple: true; maxFiles?: number; download?: boolean } & Pick<
    Partial<FinalFormFileUploadProps<true>>,
    "maxFileSize" | "readOnly" | "layout" | "accept"
>;

type InputBaseFieldConfig = {
    startAdornment?: Adornment;
    endAdornment?: Adornment;
};

export type ComponentFormFieldConfig = { type: "component"; component: ComponentType };

export type FormFieldConfig<T> = (
    | ({ type: "text"; multiline?: boolean } & InputBaseFieldConfig)
    | ({ type: "number" } & InputBaseFieldConfig)
    | ({
          type: "numberRange";
          minValue: number;
          maxValue: number;
          disableSlider?: boolean;
      } & InputBaseFieldConfig)
    | { type: "boolean" }
    | ({ type: "date" } & InputBaseFieldConfig)
    | ({ type: "dateTime" } & InputBaseFieldConfig)
    | ({
          type: "staticSelect";
          values?: Array<{ value: string; label: string } | string>;
          inputType?: "select" | "radio";
      } & Omit<InputBaseFieldConfig, "endAdornment">)
    | ({
          type: "asyncSelect";
          rootQuery: string;
          labelField?: string;
          filterField?: { name: string; gqlName?: string };
      } & Omit<InputBaseFieldConfig, "endAdornment">)
    | { type: "block"; block: BlockInterface }
    | SingleFileFormFieldConfig
    | MultiFileFormFieldConfig
) & {
    name: keyof T;
    label?: string;
    required?: boolean;
    virtual?: boolean;
    validate?: FieldValidator<unknown>;
    helperText?: string;
    readOnly?: boolean;
};

export function isFormFieldConfig<T>(arg: any): arg is FormFieldConfig<T> {
    return !isFormLayoutConfig(arg);
}

type OptionalNestedFieldsConfig<T> = {
    type: "optionalNestedFields";
    name: keyof T; // object name containing fields
    checkboxLabel?: string;
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
          fields: (FormFieldConfig<T> | OptionalNestedFieldsConfig<T> | ComponentFormFieldConfig)[];
      }
    | OptionalNestedFieldsConfig<T>;

export function isFormLayoutConfig<T>(arg: any): arg is FormLayoutConfig<T> {
    return arg.type !== undefined && ["fieldSet", "optionalNestedFields"].includes(arg.type);
}

export type FormConfig<T extends { __typename?: string }> = {
    type: "form";
    gqlType: T["__typename"];
    mode?: "edit" | "add" | "all";
    fragmentName?: string;
    createMutation?: string;
    fields: (FormFieldConfig<T> | FormLayoutConfig<T> | ComponentFormFieldConfig)[];
};

type TabsConfig = { type: "tabs"; tabs: { name: string; content: GeneratorConfig }[] };

export type BaseColumnConfig = Pick<GridColDef, "headerName" | "width" | "minWidth" | "maxWidth" | "flex" | "pinned" | "disableExport"> & {
    headerInfoTooltip?: string;
    visible?: ColumnVisibleOption;
    fieldName?: string; // this can be used to overwrite field-prop of column-config
};

export type StaticSelectLabelCellContent = {
    primaryText?: string;
    secondaryText?: string;
    icon?: Icon;
};

export type GridColumnConfig<T extends GridValidRowModel> = (
    | { type: "text"; renderCell?: (params: GridRenderCellParams<T, any, any>) => JSX.Element }
    | { type: "number"; renderCell?: (params: GridRenderCellParams<T, any, any>) => JSX.Element }
    | { type: "boolean"; renderCell?: (params: GridRenderCellParams<T, any, any>) => JSX.Element }
    | { type: "date"; renderCell?: (params: GridRenderCellParams<T, any, any>) => JSX.Element }
    | { type: "dateTime"; renderCell?: (params: GridRenderCellParams<T, any, any>) => JSX.Element }
    | { type: "staticSelect"; values?: Array<{ value: string; label: string | StaticSelectLabelCellContent } | string> }
    | { type: "block"; block: BlockInterface }
) & { name: UsableFields<T>; filterOperators?: GridFilterOperator[] } & BaseColumnConfig;

export type ActionsGridColumnConfig = { type: "actions"; component?: ComponentType<GridCellParams> } & BaseColumnConfig;
export type VirtualGridColumnConfig<T extends GridValidRowModel> = {
    type: "virtual";
    name: string;
    loadFields?: UsableFields<T>[];
    renderCell: (params: GridRenderCellParams<T, any, any>) => JSX.Element;
} & Pick<GridColDef, "sortBy"> &
    BaseColumnConfig;

type InitialFilterConfig = {
    items: GridFilterItem[];
    linkOperator?: "and" | "or";
};

export type GridConfig<T extends { __typename?: string }> = {
    type: "grid";
    gqlType: T["__typename"];
    fragmentName?: string;
    query?: string;
    queryParamsPrefix?: string;
    columns: Array<GridColumnConfig<T> | GridCombinationColumnConfig<UsableFields<T>> | ActionsGridColumnConfig | VirtualGridColumnConfig<T>>;
    excelExport?: boolean;
    add?: boolean;
    edit?: boolean;
    delete?: boolean;
    copyPaste?: boolean;
    readOnly?: boolean;
    initialSort?: Array<{ field: string; sort: GridSortDirection }>;
    initialFilter?: InitialFilterConfig;
    filterProp?: boolean;
    toolbar?: boolean;
    toolbarActionProp?: boolean;
    newEntryText?: string;
    rowActionProp?: boolean;
    selectionProps?: "multiSelect" | "singleSelect";
};

export type GeneratorConfig = FormConfig<any> | GridConfig<any> | TabsConfig;

type GQLDocumentConfig = { document: string; export: boolean };
export type GQLDocumentConfigMap = Record<string, GQLDocumentConfig>;
export type GeneratorReturn = { code: string; gqlDocuments: GQLDocumentConfigMap };

/**
 * @experimental
 */
async function runGenerate(filePattern = "src/**/*.cometGen.{ts,tsx}") {
    const schema = await loadSchema("./schema.gql", {
        loaders: [new GraphQLFileLoader()],
    });
    const gqlIntrospection = introspectionFromSchema(schema);

    const files: string[] = await glob(filePattern);
    for (const file of files) {
        let outputCode = "";
        let gqlDocumentsOutputCode = "";
        const targetDirectory = `${dirname(file)}/generated`;
        const baseOutputFilename = basename(file).replace(/\.cometGen\.tsx?$/, "");

        const configs = configsFromSourceFile(morphTsSource(file));
        //const configs = await import(`${process.cwd()}/${file.replace(/\.ts$/, "")}`);

        const codeOuputFilename = `${targetDirectory}/${basename(file.replace(/\.cometGen\.tsx?$/, ""))}.tsx`;
        await fs.rm(codeOuputFilename, { force: true });

        console.log(`generating ${file}`);

        for (const exportName in configs) {
            const config = configs[exportName];
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
                const exportStatement = generated.gqlDocuments[queryName].export ? "export " : "";
                gqlDocumentsOutputCode += `${exportStatement} const ${queryName} = gql\`${generated.gqlDocuments[queryName].document}\`\n`;
            }
        }

        await writeGenerated(codeOuputFilename, outputCode);

        if (gqlDocumentsOutputCode != "") {
            const gqlDocumentsOuputFilename = `${targetDirectory}/${basename(file.replace(/\.cometGen\.tsx?$/, ""))}.gql.tsx`;
            await fs.rm(gqlDocumentsOuputFilename, { force: true });
            gqlDocumentsOutputCode = `import { gql } from "@apollo/client";
                import { finalFormFileUploadFragment, finalFormFileUploadDownloadableFragment } from "@comet/cms-admin";

                ${gqlDocumentsOutputCode}
            `;
            await writeGenerated(gqlDocumentsOuputFilename, gqlDocumentsOutputCode);
        }
    }
}

export const generateCommand = new Command("generate")
    .option("-f, --file <file>", "path to config file or glob pattern to generate specific files")
    .action(async ({ file: filePattern }: { file?: string }) => {
        console.log("️️️⚠️️️⚠️️️⚠️️️  Admin Generator is still experimental and in beta phase.  ⚠️️️⚠️️️⚠️️️\n\n");
        await runGenerate(filePattern);
    });
