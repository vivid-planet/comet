import { camelCase } from "change-case";

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
    return `${renderToolbarProps(componentName, !!forwardToolbarAction, !!excelExport)}
    function ${componentName}(${getGridToolbarProps(componentName, !!forwardToolbarAction, !!excelExport)}) {
        return (
            <DataGridToolbar>
                ${hasSearch ? searchItem : ""}
                ${hasFilter ? filterItem : ""}
                <ToolbarFillSpace />
                ${renderToolbarActions({
                    forwardToolbarAction,
                    addItemText: getFormattedMessageNode(
                        `${instanceGqlType}.${camelCase(fragmentName)}.newEntry`,
                        newEntryText ?? `New ${camelCaseToHumanReadable(gqlType)}`,
                    ),
                    excelExport,
                    allowAdding,
                })}
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
            typeDefinition: "toolbarAction?: ReactNode",
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

type RenderToolbarActionsOptions = {
    forwardToolbarAction: boolean | undefined;
    addItemText: string;
    excelExport: boolean | undefined;
    allowAdding: boolean | undefined;
};

const renderToolbarActions = ({ forwardToolbarAction, addItemText, excelExport, allowAdding }: RenderToolbarActionsOptions) => {
    const showMoreActionsMenu = excelExport;

    if (!showMoreActionsMenu && !allowAdding) {
        return "";
    }

    const moreActionsMenu = `<CrudMoreActionsMenu
        slotProps={{
            button: {
                responsive: true
            }
        }}
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

    const defaultAddItemButton = `<Button responsive startIcon={<AddIcon />} component={StackLink} pageName="add" payload="add">
        ${addItemText}
    </Button>`;

    const addAction = forwardToolbarAction ? "{toolbarAction}" : defaultAddItemButton;

    return `<ToolbarActions>
        ${showMoreActionsMenu ? moreActionsMenu : ""}
        ${allowAdding ? addAction : ""}
    </ToolbarActions>`;
};

const renderToolbarProps = (componentName: string, forwardToolbarAction: boolean | undefined, exportApi: boolean) => {
    if (forwardToolbarAction || exportApi) {
        return `interface ${componentName}ToolbarProps extends GridToolbarProps {
         ${forwardToolbarAction && "toolbarAction: ReactNode;"}
         ${exportApi ? "exportApi: ExportApi;" : ""}
}`;
    }
    return "";
};
