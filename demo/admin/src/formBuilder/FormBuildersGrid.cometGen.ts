import { future_GridConfig as GridConfig } from "@comet/cms-admin";
import { GQLFormBuilder } from "@src/graphql.generated";

export const FormBuildersGrid: GridConfig<GQLFormBuilder> = {
    type: "grid",
    gqlType: "FormBuilder",
    fragmentName: "FormBuildersGrid",
    toolbarActionProp: true,
    copyPaste: false, // TODO: Copy-Paste is currently broken - will be fixed in https://vivid-planet.atlassian.net/browse/COM-1515
    columns: [
        { type: "text", name: "name", headerName: "Name", flex: 2 },
        { type: "date", name: "createdAt", headerName: "Created" },
        { type: "date", name: "updatedAt", headerName: "Last updated" },
    ],
};
