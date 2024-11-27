import { future_GridConfig as GridConfig } from "@comet/cms-admin";

import { GQLFormBuilder } from "../../graphql.generated";

export const FormBuildersGrid: GridConfig<GQLFormBuilder> = {
    type: "grid",
    gqlType: "FormBuilder",
    fragmentName: "FormBuildersGrid",
    toolbarActionProp: true,
    copyPaste: false, // TODO: Should/can we enable this?
    // TODO: Add button for "View submissions"
    columns: [
        { type: "text", name: "name", headerName: "Name", flex: 2 },
        { type: "date", name: "createdAt", headerName: "Erstellt am" },
        { type: "date", name: "updatedAt", headerName: "Zuletzt geändert" },
        // TODO: Add column for `published` status
    ],
};
