import { camelCaseToHumanReadable } from "../utils/camelCaseToHumanReadable";
import { getFormattedMessageNode } from "../utils/intl";

const lowerCaseFirst = (string: string) => string.charAt(0).toLowerCase() + string.substring(1);

type Options = {
    componentName: string;
    forwardToolbarAction: boolean | undefined;
    hasSearch: boolean;
    hasFilter: boolean;
    excelExport: boolean | undefined;
    allowAdding: boolean;
    instanceGqlType: string;
    gqlType: string;
    newEntryText: string | undefined;
    fragmentName: string;
};

export const generateGridToolbar = ({
    componentName,
    forwardToolbarAction,
    hasSearch,
    hasFilter,
    excelExport,
    allowAdding,
    instanceGqlType,
    gqlType,
    newEntryText,
    fragmentName,
}: Options) => {
    const showMoreActionsMenu = excelExport;

    return `function ${componentName}(${getGridToolbarProps(!!forwardToolbarAction, !!excelExport)}) {
        return (
            <DataGridToolbar>
                ${hasSearch ? searchItem : ""}
                ${hasFilter ? filterItem : ""}
                <ToolbarFillSpace />
                ${showMoreActionsMenu ? renderMoreActionsMenu(excelExport) : ""}
              ${allowAdding ? renderToolbarActions(forwardToolbarAction, instanceGqlType, gqlType, newEntryText, fragmentName) : ""}
            </DataGridToolbar>
        );
    }`.replace(/^\s+\n/gm, "");
};

const getGridToolbarProps = (toolbarAction: boolean, exportApi: boolean) => {
    const props: Array<{
        destructured: string;
        typeDefinition: string;
    }> = [];

    if (toolbarAction) {
        props.push({
            destructured: "toolbarAction",
            typeDefinition: "toolbarAction?: React.ReactNode",
        });
    }

    if (exportApi) {
        props.push({
            destructured: "exportApi",
            typeDefinition: "exportApi: ExportApi",
        });
    }

    if (!props.length) {
        return "";
    }

    return `{
        ${props.map((prop) => `${prop.destructured}`).join(",")}
    }: {
        ${props.map((prop) => prop.typeDefinition).join(";")}
    }`;
};

const searchItem = `<ToolbarItem>
    <GridToolbarQuickFilter />
</ToolbarItem>`;

const filterItem = `<ToolbarItem>
    <GridFilterButton />
</ToolbarItem>`;

const renderMoreActionsMenu = (excelExport: boolean | undefined) => {
    return `<CrudMoreActionsMenu
        overallActions={[
            ${
                excelExport
                    ? `{
                label: <FormattedMessage {...messages.downloadAsExcel} />,
                icon: exportApi.loading ? <CircularProgress size={20} /> : <Excel />,
                onClick: () => exportApi.exportGrid(),
                disabled: exportApi.loading,
            }`
                    : ""
            }
        ]}
    />`;
};

const renderToolbarActions = (
    forwardToolbarAction: boolean | undefined,
    instanceGqlType: string,
    gqlType: string,
    newEntryText: string | undefined,
    fragmentName: string,
) => {
    if (forwardToolbarAction) {
        return `{toolbarAction && <ToolbarActions>{toolbarAction}</ToolbarActions>}`;
    }

    return `<ToolbarActions>
        <Button startIcon={<AddIcon />} component={StackLink} pageName="add" payload="add" variant="contained" color="primary">
            ${getFormattedMessageNode(
                `${instanceGqlType}.${lowerCaseFirst(fragmentName)}.newEntry`,
                newEntryText ?? `New ${camelCaseToHumanReadable(gqlType)}`,
            )}
        </Button>
    </ToolbarActions>`;
};
