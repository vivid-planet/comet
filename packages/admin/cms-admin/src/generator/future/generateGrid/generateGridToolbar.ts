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

    return `function ${componentName}(${getGridToolbarProps(!!forwardToolbarAction, !!excelExport)}) {
    ${
        showMoreActionsMenu
            ? `const [showMoreActionsMenu, setShowMoreActionsMenu] = React.useState(false);
                const moreActionsMenuRef = React.useRef<HTMLButtonElement>(null);`
            : ""
    }

        return (
            <DataGridToolbar>
                ${hasSearch ? searchItem : ""}
                ${hasFilter ? filterItem : ""}
                <ToolbarFillSpace />
                ${renderMoreActionsMenuButton(showMoreActionsMenu, getFormattedMessageNode(`${instanceGqlType}.moreActions`, `More actions`))}
              ${
                  allowAdding
                      ? renderToolbarActions(
                            forwardToolbarAction,
                            getFormattedMessageNode(`${instanceGqlType}.new${gqlType}`, `New ${camelCaseToHumanReadable(gqlType)}`),
                        )
                      : ""
              }
                ${renderMoreActionsMenu(instanceGqlType, showMoreActionsMenu, excelExport)}
            </DataGridToolbar>
        );
    }`.replace(/^\s+\n/gm, "");
};

const getGridToolbarProps = (toolbarAction: boolean, exportApi: boolean) => {
    if (!toolbarAction && !exportApi) {
        return "";
    }
    return `{
            ${toolbarAction ? `toolbarAction,` : ""}
            ${exportApi ? `exportApi,` : ""}
        }: {
            ${toolbarAction ? `toolbarAction?: React.ReactNode,` : ""}
            ${exportApi ? `exportApi: ExportApi,` : ""}
        }`;
};

const searchItem = `<ToolbarItem>
    <GridToolbarQuickFilter />
</ToolbarItem>`;

const filterItem = `<ToolbarItem>
    <GridFilterButton />
</ToolbarItem>`;

const renderMoreActionsMenuButton = (showMoreActionsMenu: boolean | undefined, buttonText: string) => {
    if (!showMoreActionsMenu) {
        return "";
    }

    return `<ToolbarItem>
        <Button
            color="info"
            ref={moreActionsMenuRef}
            onClick={() => {
                setShowMoreActionsMenu(true);
            }}
            endIcon={<MoreVertical />}
        >
            ${buttonText}
        </Button>
    </ToolbarItem>`;
};

const renderMoreActionsMenu = (formattedMessageIdPrefix: string, showMoreActionsMenu: boolean | undefined, excelExport: boolean | undefined) => {
    if (!showMoreActionsMenu) {
        return "";
    }

    return `<Menu
        open={showMoreActionsMenu}
        onClose={() => setShowMoreActionsMenu(false)}
        anchorEl={moreActionsMenuRef.current}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}>
        ${
            excelExport
                ? `<MenuItem onClick={() => exportApi.exportGrid()} disabled={exportApi.loading}>
                   <ListItemIcon>
                        {exportApi.loading ? <CircularProgress size={20} /> : <Excel />}
                    </ListItemIcon>
                    <ListItemText>
                        ${getFormattedMessageNode(`${formattedMessageIdPrefix}.downloadAsExcel`, `Download as Excel`)}
                    </ListItemText>
                </MenuItem>`
                : ""
        }
    </Menu>`;
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
