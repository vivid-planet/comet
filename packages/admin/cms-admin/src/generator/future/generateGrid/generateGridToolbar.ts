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
    renderToolbar,
    gqlTypePlural,
    forwardToolbarAction,
    hasSearch,
    hasFilter,
    allowAdding,
    instanceGqlType,
    gqlType,
}: Options) => {
    if (!renderToolbar) {
        return "";
    }

    return `function ${gqlTypePlural}GridToolbar(${forwardToolbarAction ? `{ toolbarAction }: { toolbarAction?: React.ReactNode }` : ``}) {
        return (
            <DataGridToolbar>
                ${renderSearchItem(hasSearch)}
                ${renderFilterItem(hasFilter)}
                <ToolbarFillSpace />
                ${renderToolbarActions(
                    allowAdding,
                    forwardToolbarAction,
                    getFormattedMessageNode(`${instanceGqlType}.new${gqlType}`, `New ${camelCaseToHumanReadable(gqlType)}`),
                )}
            </DataGridToolbar>
        );
    }`;
};

const renderSearchItem = (hasSearch: boolean) => {
    if (!hasSearch) {
        return "";
    }

    return `<ToolbarItem>
        <GridToolbarQuickFilter />
    </ToolbarItem>`;
};

const renderFilterItem = (hasFilter: boolean) => {
    if (!hasFilter) {
        return "";
    }

    return `<ToolbarItem>
        <GridFilterButton />
    </ToolbarItem>`;
};

const renderToolbarActions = (allowAdding: boolean, forwardToolbarAction: boolean | undefined, addItemText: string) => {
    if (!allowAdding) {
        return "";
    }

    if (forwardToolbarAction) {
        return `{toolbarAction && <ToolbarActions>{toolbarAction}</ToolbarActions>}`;
    }

    return `<ToolbarActions>
        <Button startIcon={<AddIcon />} component={StackLink} pageName="add" payload="add" variant="contained" color="primary">
            ${addItemText}
        </Button>
    </ToolbarActions>`;
};
