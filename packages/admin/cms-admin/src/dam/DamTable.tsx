import { useQuery } from "@apollo/client";
import {
    EditDialogApiContext,
<<<<<<< HEAD
    FillSpace,
    type IFilterApi,
    type ISortInformation,
=======
    IFilterApi,
    ISortInformation,
>>>>>>> main
    SortDirection,
    Stack,
    StackPage,
    StackSwitch,
    Toolbar,
    useEditDialog,
    useStackApi,
    useStoredState,
    useTableQueryFilter,
} from "@comet/admin";
import { type ReactNode, useEffect, useState } from "react";
import { useIntl } from "react-intl";

import { CurrentDamFolderProvider } from "./CurrentDamFolderProvider";
import { ManualDuplicatedFilenamesHandlerContextProvider } from "./DataGrid/duplicatedFilenames/ManualDuplicatedFilenamesHandler";
import { FileUploadContextProvider } from "./DataGrid/fileUpload/FileUploadContext";
import FolderDataGrid, {
    damFolderQuery,
    type GQLDamFileTableFragment,
    type GQLDamFolderQuery,
    type GQLDamFolderQueryVariables,
    type GQLDamFolderTableFragment,
} from "./DataGrid/FolderDataGrid";
<<<<<<< HEAD
import { type RenderDamLabelOptions } from "./DataGrid/label/DamItemLabelColumn";
import { DamMoreActions } from "./DataGrid/selection/DamMoreActions";
=======
import { RenderDamLabelOptions } from "./DataGrid/label/DamItemLabelColumn";
>>>>>>> main
import { DamSelectionProvider } from "./DataGrid/selection/DamSelectionContext";
import EditFile from "./FileForm/EditFile";

interface FolderProps extends DamConfig {
    filterApi: IFilterApi<DamFilter>;
    additionalToolbarItems?: ReactNode;
    id?: string;
}

export interface DamFilter {
    allowedMimetypes?: string[];
    archived?: boolean;
    searchText?: string;
    sort?: ISortInformation;
}

const Folder = ({ id, filterApi, ...props }: FolderProps) => {
    const intl = useIntl();
    const stackApi = useStackApi();
    const [, , editDialogApi, selectionApi] = useEditDialog();

    // The selectedFolderId is only used to determine the name of a folder for the "folder" stack page
    // If you want to use the id of the current folder in the "table" stack page, use the id prop
    const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>();
    const { data } = useQuery<GQLDamFolderQuery, GQLDamFolderQueryVariables>(damFolderQuery, {
        variables: {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            id: selectedFolderId!,
        },
        skip: selectedFolderId === undefined,
    });

    return (
        <CurrentDamFolderProvider folderId={id}>
            <StackSwitch initialPage="table">
                <StackPage name="table">
                    <EditDialogApiContext.Provider value={editDialogApi}>
                        <Toolbar scopeIndicator={props.contentScopeIndicator} />
                        <FolderDataGrid id={id} breadcrumbs={stackApi?.breadCrumbs} selectionApi={selectionApi} filterApi={filterApi} {...props} />
                    </EditDialogApiContext.Provider>
                </StackPage>
                <StackPage name="edit" title={intl.formatMessage({ id: "comet.pages.dam.edit", defaultMessage: "Edit" })}>
                    {(selectedId: string) => {
                        return <EditFile id={selectedId} contentScopeIndicator={props.contentScopeIndicator} />;
                    }}
                </StackPage>
                <StackPage name="folder" title={data?.damFolder.name}>
                    {(selectedId) => {
                        setSelectedFolderId(selectedId);
                        return <Folder id={selectedId} filterApi={filterApi} {...props} />;
                    }}
                </StackPage>
            </StackSwitch>
        </CurrentDamFolderProvider>
    );
};

export interface DamConfig {
    renderDamLabel?: (row: GQLDamFileTableFragment | GQLDamFolderTableFragment, options: RenderDamLabelOptions) => ReactNode;
    hideArchiveFilter?: boolean;
    hideContextMenu?: boolean;
    allowedMimetypes?: string[];
    contentScopeIndicator?: ReactNode;
    hideMultiselect?: boolean;
    hideDamActions?: boolean;
    additionalToolbarItems?: ReactNode;
}

type DamTableProps = DamConfig;

export const DamTable = ({ ...props }: DamTableProps) => {
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

    useEffect(() => {
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
