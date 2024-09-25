import { camelCaseToHumanReadable } from "../utils/camelCaseToHumanReadable";
import { getFormattedMessageNode } from "../utils/intl";

type Options = {
    renderToolbar: boolean;
    gqlTypePlural: string;
    forwardToolbarAction: boolean | undefined;
    hasSearch: boolean;
    hasFilter: boolean;
    allowAdding: boolean;
    instanceGqlType: string;
    gqlType: string;
};

export const generateGridToolbar = ({
    gqlTypePlural,
    forwardToolbarAction,
    hasSearch,
    hasFilter,
    allowAdding,
    instanceGqlType,
    gqlType,
}: Options) => {
    return `function ${gqlTypePlural}GridToolbar(${forwardToolbarAction ? `{ toolbarAction }: { toolbarAction?: React.ReactNode }` : ``}) {
        return (
            <DataGridToolbar>
                ${hasSearch ? searchItem : ""}
                ${hasFilter ? filterItem : ""}
                <ToolbarFillSpace />
                ${
                    allowAdding
                        ? renderToolbarActions(
                              forwardToolbarAction,
                              getFormattedMessageNode(`${instanceGqlType}.new${gqlType}`, `New ${camelCaseToHumanReadable(gqlType)}`),
                          )
                        : ""
                }
            </DataGridToolbar>
        );
    }`;
};

const searchItem = `<ToolbarItem>
    <GridToolbarQuickFilter />
</ToolbarItem>`;

const filterItem = `<ToolbarItem>
    <GridFilterButton />
</ToolbarItem>`;

const renderToolbarActions = (forwardToolbarAction: boolean | undefined, addItemText: string) => {
    if (forwardToolbarAction) {
        return `{toolbarAction && <ToolbarActions>{toolbarAction}</ToolbarActions>}`;
    }

    return `<ToolbarActions>
        <Button startIcon={<AddIcon />} component={StackLink} pageName="add" payload="add" variant="contained" color="primary">
            ${addItemText}
        </Button>
    </ToolbarActions>`;
};
