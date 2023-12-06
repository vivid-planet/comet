import { useQuery } from "@apollo/client";
import {
    EditDialogApiContext,
    IFilterApi,
    ISortInformation,
    SortDirection,
    Stack,
    StackPage,
    StackSwitch,
    Toolbar,
    ToolbarActions,
    ToolbarFillSpace,
    ToolbarItem,
    useEditDialog,
    useStackApi,
    useStoredState,
    useTableQueryFilter,
} from "@comet/admin";
import { MoreVertical } from "@comet/admin-icons";
import { Button } from "@mui/material";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ManualDuplicatedFilenamesHandlerContextProvider } from "./DataGrid/duplicatedFilenames/ManualDuplicatedFilenamesHandler";
import { FileUploadContextProvider } from "./DataGrid/fileUpload/FileUploadContext";
import { UploadFilesButton } from "./DataGrid/fileUpload/UploadFilesButton";
import { DamTableFilter } from "./DataGrid/filter/DamTableFilter";
import FolderDataGrid, {
    damFolderQuery,
    GQLDamFileTableFragment,
    GQLDamFolderQuery,
    GQLDamFolderQueryVariables,
    GQLDamFolderTableFragment,
} from "./DataGrid/FolderDataGrid";
import { RenderDamLabelOptions } from "./DataGrid/label/DamItemLabelColumn";
import { DamMoreActions } from "./DataGrid/selection/DamMoreActions";
import { DamSelectionProvider } from "./DataGrid/selection/DamSelectionContext";
import EditFile from "./FileForm/EditFile";

interface FolderProps extends DamConfig {
    filterApi: IFilterApi<DamFilter>;
    additionalToolbarItems?: React.ReactNode;
    id?: string;
}

export interface DamFilter {
    allowedMimetypes?: string[];
    archived?: boolean;
    searchText?: string;
    sort?: ISortInformation;
}

type FolderContextType = {
    folderId: string | undefined;
};

const FolderContext = React.createContext<FolderContextType>({ folderId: undefined });

export function useFolderContext(): FolderContextType {
    const context = React.useContext(FolderContext);
    if (!context) {
        throw new Error("useFolderContext must be used within a FolderContextProvider");
    }
    return context;
}

const Folder = ({ id, filterApi, ...props }: FolderProps) => {
    const intl = useIntl();
    const stackApi = useStackApi();
    const [, , editDialogApi, selectionApi] = useEditDialog();

    // The selectedFolderId is only used to determine the name of a folder for the "folder" stack page
    // If you want to use the id of the current folder in the "table" stack page, use the id prop
    const [selectedFolderId, setSelectedFolderId] = React.useState<string | undefined>();
    const { data } = useQuery<GQLDamFolderQuery, GQLDamFolderQueryVariables>(damFolderQuery, {
        variables: {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            id: selectedFolderId!,
        },
        skip: selectedFolderId === undefined,
    });

    const uploadFilters = {
        allowedMimetypes: props.allowedMimetypes,
    };

    return (
        <StackSwitch initialPage="table">
            <StackPage name="table">
                <EditDialogApiContext.Provider value={editDialogApi}>
                    {props.contentScopeIndicator}
                    <Toolbar>
                        <ToolbarItem>
                            <DamTableFilter hideArchiveFilter={props.hideArchiveFilter} filterApi={filterApi} />
                        </ToolbarItem>
                        <ToolbarFillSpace />
                        <ToolbarActions>
                            <FolderContext.Provider
                                value={{
                                    folderId: id,
                                }}
                            >
                                {props.additionalToolbarItems}
                            </FolderContext.Provider>
                            <DamMoreActions
                                button={
                                    <Button variant="text" color="inherit" endIcon={<MoreVertical />} sx={{ mx: 2 }}>
                                        <FormattedMessage id="comet.pages.dam.moreActions" defaultMessage="More actions" />
                                    </Button>
                                }
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "left",
                                }}
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "left",
                                }}
                                folderId={id}
                                filter={uploadFilters}
                            />

                            <UploadFilesButton folderId={id} filter={uploadFilters} />
                        </ToolbarActions>
                    </Toolbar>
                    <FolderDataGrid id={id} breadcrumbs={stackApi?.breadCrumbs} selectionApi={selectionApi} filterApi={filterApi} {...props} />
                </EditDialogApiContext.Provider>
            </StackPage>
            <StackPage name="edit" title={intl.formatMessage({ id: "comet.pages.dam.edit", defaultMessage: "Edit" })}>
                {(selectedId: string) => {
                    return <EditFile id={selectedId} />;
                }}
            </StackPage>
            <StackPage name="folder" title={data?.damFolder.name}>
                {(selectedId) => {
                    setSelectedFolderId(selectedId);
                    return <Folder id={selectedId} filterApi={filterApi} {...props} />;
                }}
            </StackPage>
        </StackSwitch>
    );
};

export interface DamConfig {
    renderDamLabel?: (row: GQLDamFileTableFragment | GQLDamFolderTableFragment, options: RenderDamLabelOptions) => React.ReactNode;
    hideArchiveFilter?: boolean;
    hideContextMenu?: boolean;
    allowedMimetypes?: string[];
    contentScopeIndicator?: React.ReactNode;
    hideMultiselect?: boolean;
    hideDamActions?: boolean;
    additionalToolbarItems?: React.ReactNode;
}

type DamTableProps = DamConfig;

export const DamTable = ({ ...props }: DamTableProps): React.ReactElement => {
    const intl = useIntl();
    const [sorting, setSorting] = useStoredState<ISortInformation>("dam_filter_sorting", {
        columnName: "name",
        direction: SortDirection.ASC,
    });

    const propsWithDefaultValues = {
        hideContextMenu: false,
        hideMultiselect: false,
        hideDamActions: false,
        hideArchiveFilter: false,
        ...props,
    };

    const filterApi = useTableQueryFilter<DamFilter>({
        sort: sorting,
    });

    React.useEffect(() => {
        if (filterApi.current.sort) {
            setSorting(filterApi.current.sort);
        }
    }, [filterApi, filterApi.current.sort, setSorting]);

    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "comet.pages.dam.assetManager", defaultMessage: "Asset Manager" })}>
            <FileUploadContextProvider>
                <ManualDuplicatedFilenamesHandlerContextProvider>
                    <DamSelectionProvider>
                        <Folder filterApi={filterApi} {...propsWithDefaultValues} additionalToolbarItems={props.additionalToolbarItems} />
                    </DamSelectionProvider>
                </ManualDuplicatedFilenamesHandlerContextProvider>
            </FileUploadContextProvider>
        </Stack>
    );
};
