import { camelCaseToHumanReadable } from "../utils/camelCaseToHumanReadable";
import { getFormattedMessageNode } from "../utils/intl";

type Options = {
    componentName: string;
    forwardToolbarAction: boolean | undefined;
    hasSearch: boolean;
    hasFilter: boolean;
    excelExport: boolean | undefined;
    allowAdding: boolean;
    instanceGqlType: string;
    gqlType: string;
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
}: Options) => {
    const showMoreActionsMenu = excelExport;

    return `${renderToolbarProps(componentName, !!forwardToolbarAction, !!excelExport)}
function ${componentName}(${getGridToolbarProps(componentName, !!forwardToolbarAction, !!excelExport)}) {
        return (
            <DataGridToolbar>
                ${hasSearch ? searchItem : ""}
                ${hasFilter ? filterItem : ""}
                <ToolbarFillSpace />
                ${showMoreActionsMenu ? renderMoreActionsMenu(excelExport) : ""}
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
    }`.replace(/^\s+\n/gm, "");
};

const getGridToolbarProps = (componentName: string, toolbarAction: boolean, exportApi: boolean) => {
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
    }: ${componentName}ToolbarProps`;
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

const renderToolbarProps = (componentName: string, forwardToolbarAction: boolean | undefined, exportApi: boolean) => {
    if (forwardToolbarAction || exportApi) {
        return `interface ${componentName}ToolbarProps extends GridToolbarProps {
         ${forwardToolbarAction && "toolbarAction: React.ReactNode;"}
         ${exportApi ? "exportApi: ExportApi;" : ""}
}`;
    }
    return "";
};
