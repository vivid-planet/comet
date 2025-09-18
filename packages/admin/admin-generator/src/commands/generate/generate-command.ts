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

import { parseConfig } from "./config/parseConfig";
import { generateForm } from "./generateForm/generateForm";
import { generateGrid } from "./generateGrid/generateGrid";
import { type UsableFields } from "./generateGrid/usableFields";
import { type ColumnVisibleOption } from "./utils/columnVisibility";
import { writeGenerated } from "./utils/writeGenerated";

type IconObject = Pick<IconProps, "color" | "fontSize"> & {
    name: IconName;
};

type Icon = IconName | IconObject | ComponentType;
export type Adornment = string | { icon: Icon };

type InputBaseFieldConfig = {
    startAdornment?: Adornment;
    endAdornment?: Adornment;
};

export type ComponentFormFieldConfig = { type: "component"; component: ComponentType };
function isComponentFormFieldConfig(arg: any): arg is ComponentFormFieldConfig {
    return arg && arg.type === "component";
}

export type StaticSelectValue = { value: string; label: string } | string;

export type FormFieldConfig<T> = (
    | ({ type: "text"; name: keyof T; multiline?: boolean } & InputBaseFieldConfig)
    | ({ type: "number"; name: keyof T; decimals?: number } & InputBaseFieldConfig)
    | ({
          type: "numberRange";
          name: keyof T;
          minValue: number;
          maxValue: number;
          disableSlider?: boolean;
      } & InputBaseFieldConfig)
    | { type: "boolean"; name: keyof T }
    | ({ type: "date"; name: keyof T } & InputBaseFieldConfig)
    | ({ type: "dateTime"; name: keyof T } & InputBaseFieldConfig)
    | ({
          type: "staticSelect";
          name: keyof T;
          values?: StaticSelectValue[];
          inputType?: "select" | "radio";
      } & Omit<InputBaseFieldConfig, "endAdornment">)
    | ({
          type: "asyncSelect";
          name: keyof T;
          rootQuery: string;
          labelField?: string;
          /**
           * filter for query, passed as variable to graphql query
           */
          filter?:
              | {
                    /**
                     * Filter by value of field in current form
                     */
                    type: "field";
                    /**
                     * Name of the field in current form, that will be used to filter the query
                     */
                    formFieldName: string;
                    /**
                     * Name of the graphql argument the prop will be applied to. Defaults to propdName.
                     *
                     * Root Argument or filter argument are supported.
                     */
                    rootQueryArg?: string;
                }
              | {
                    /**
                     * Filter by a prop passed into the form, this prop will be generated
                     */
                    type: "formProp";
                    /**
                     * Name of the prop generated for this form
                     */
                    propName: string;
                    /**
                     * Name of the graphql argument the prop will be applied to. Defaults to propdName.
                     *
                     * Root Argument or filter argument are supported.
                     */
                    rootQueryArg?: string;
                };
      } & Omit<InputBaseFieldConfig, "endAdornment">)
    | ({
          type: "asyncSelectFilter";
          name: string;
          loadValueQueryField: string; //TODO improve typing, use something similar to UsableFields<T>;
          rootQuery: string;
          labelField?: string;
      } & Omit<InputBaseFieldConfig, "endAdornment">)
    | { type: "block"; name: keyof T; block: BlockInterface }
    | ({ type: "fileUpload"; multiple?: false; name: keyof T; maxFiles?: 1; download?: boolean } & Pick<
          Partial<FinalFormFileUploadProps<false>>,
          "maxFileSize" | "readOnly" | "layout" | "accept"
      >)
    | ({ type: "fileUpload"; multiple: true; name: keyof T; maxFiles?: number; download?: boolean } & Pick<
          Partial<FinalFormFileUploadProps<true>>,
          "maxFileSize" | "readOnly" | "layout" | "accept"
      >)
) & {
    label?: string;
    required?: boolean;
    virtual?: boolean;
    validate?: FieldValidator<unknown>;
    helperText?: string;
    readOnly?: boolean;
};

export function isFormFieldConfig<T>(arg: any): arg is FormFieldConfig<T> {
    return !isFormLayoutConfig(arg) && !isComponentFormFieldConfig(arg);
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

type BaseColumnConfig = Pick<GridColDef, "headerName" | "width" | "minWidth" | "maxWidth" | "flex" | "pinned" | "disableExport"> & {
    headerInfoTooltip?: string;
    visible?: ColumnVisibleOption;
    fieldName?: string; // this can be used to overwrite field-prop of column-config
};

export type GridColumnStaticSelectLabelCellContent = {
    primaryText?: string;
    secondaryText?: string;
    icon?: Icon;
};

export type GridColumnStaticSelectValue =
    | StaticSelectValue
    | {
          value: string | number | boolean;
          label: string | GridColumnStaticSelectLabelCellContent;
      }
    | number
    | boolean;

export type GridColumnConfig<T extends GridValidRowModel> = (
    | { type: "text"; renderCell?: (params: GridRenderCellParams<T, any, any>) => JSX.Element }
    | { type: "number"; currency?: string; decimals?: number; renderCell?: (params: GridRenderCellParams<T, any, any>) => JSX.Element }
    | { type: "boolean"; renderCell?: (params: GridRenderCellParams<T, any, any>) => JSX.Element }
    | { type: "date"; renderCell?: (params: GridRenderCellParams<T, any, any>) => JSX.Element }
    | { type: "dateTime"; renderCell?: (params: GridRenderCellParams<T, any, any>) => JSX.Element }
    | { type: "staticSelect"; values?: GridColumnStaticSelectValue[] }
    | { type: "block"; block: BlockInterface }
    | { type: "id"; renderCell?: (params: GridRenderCellParams<T, any, any>) => JSX.Element }
    | {
          type: "manyToMany";
          renderCell?: (params: GridRenderCellParams<T, any, any>) => JSX.Element;
          queryFields?: UsableFields<T, true>[];
          /**
           * The field to use as label for the default renderCell implementation.
           */
          labelField?: string;
      }
    | {
          type: "oneToMany";
          renderCell?: (params: GridRenderCellParams<T, any, any>) => JSX.Element;
          queryFields?: UsableFields<T, true>[];
          /**
           * The field to use as label for the default renderCell implementation.
           */
          labelField?: string;
      }
) & { name: UsableFields<T>; filterOperators?: GridFilterOperator[] } & BaseColumnConfig;

export type ActionsGridColumnConfig<T> = {
    type: "actions";
    queryFields?: UsableFields<T, true>[];
    component?: ComponentType<GridCellParams>;
} & BaseColumnConfig;
export type VirtualGridColumnConfig<T extends GridValidRowModel> = {
    type: "virtual";
    name: string;
    queryFields?: UsableFields<T, true>[];
    renderCell: (params: GridRenderCellParams<T, any, any>) => JSX.Element;
} & Pick<GridColDef, "sortBy"> &
    BaseColumnConfig;

type InitialFilterConfig = {
    items: GridFilterItem[];
    linkOperator?: "and" | "or";
};

// Additional type is necessary to avoid "TS2589: Type instantiation is excessively deep and possibly infinite."
type GridConfigGridColumnDef<T extends { __typename?: string }> = GridColumnConfig<T> | ActionsGridColumnConfig<T> | VirtualGridColumnConfig<T>;

export type GridConfig<T extends { __typename?: string }> = {
    type: "grid";
    gqlType: T["__typename"];
    fragmentName?: string;
    query?: string;
    queryParamsPrefix?: string;
    columns: Array<GridConfigGridColumnDef<T>>;
    excelExport?: boolean;
    add?: boolean;
    edit?: boolean;
    delete?: boolean;
    readOnly?: boolean;
    initialSort?: Array<{ field: string; sort: GridSortDirection }>;
    initialFilter?: InitialFilterConfig;
    filterProp?: boolean;
    toolbar?: boolean;
    toolbarActionProp?: boolean;
    newEntryText?: string;
    rowActionProp?: boolean;
    selectionProps?: "multiSelect" | "singleSelect";
    rowReordering?: {
        enabled: boolean;
        dragPreviewField?: UsableFields<T>;
    };
};

export type GeneratorConfig<T extends { __typename?: string }> = FormConfig<T> | GridConfig<T>;

export function defineConfig<T extends { __typename?: string }>(config: GeneratorConfig<T>) {
    return config;
}

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

        console.log(`generating ${file}`);

        const config = await parseConfig(file);

        const codeOuputFilename = `${targetDirectory}/${basename(file.replace(/\.cometGen\.tsx?$/, ""))}.tsx`;
        await fs.rm(codeOuputFilename, { force: true });

        const exportName = file.match(/([^/]+)\.cometGen\.tsx?$/)?.[1];
        if (!exportName) throw new Error("Can not determine exportName");

        let generated: GeneratorReturn;
        if (config.type == "form") {
            generated = generateForm({ exportName, gqlIntrospection, baseOutputFilename, targetDirectory }, config);
        } else if (config.type == "grid") {
            generated = generateGrid({ exportName, gqlIntrospection, baseOutputFilename, targetDirectory }, config);
        } else {
            throw new Error(`Unknown config type`);
        }
        outputCode += generated.code;
        for (const queryName in generated.gqlDocuments) {
            const exportStatement = generated.gqlDocuments[queryName].export ? "export " : "";
            gqlDocumentsOutputCode += `${exportStatement} const ${queryName} = gql\`${generated.gqlDocuments[queryName].document}\`\n`;
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
        console.log("");
    }
}

export const generateCommand = new Command("generate")
    .option("-f, --file <file>", "path to config file or glob pattern to generate specific files")
    .action(async ({ file: filePattern }: { file?: string }) => {
        console.log("️️️⚠️️️⚠️️️⚠️️️  Admin Generator is still experimental and in beta phase.  ⚠️️️⚠️️️⚠️️️\n\n");
        await runGenerate(filePattern);
    });
