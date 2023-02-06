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
import { AddFolder as AddFolderIcon } from "@comet/admin-icons";
import { Button } from "@mui/material";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { TextMatch } from "../common/MarkedMatches";
import { GQLDamFileTableFragment, GQLDamFolderQuery, GQLDamFolderQueryVariables, GQLDamFolderTableFragment } from "../graphql.generated";
import EditFile from "./FileForm/EditFile";
import { ManualDuplicatedFilenamesHandlerContextProvider } from "./Table/duplicatedFilenames/ManualDuplicatedFilenamesHandler";
import { FileUploadContextProvider } from "./Table/fileUpload/FileUploadContext";
import { UploadSplitButton } from "./Table/fileUpload/UploadSplitButton";
import { DamTableFilter } from "./Table/filter/DamTableFilter";
import FolderTable from "./Table/FolderTable";
import { damFolderQuery } from "./Table/FolderTable.gql";
import { RedirectToPersistedDamLocation } from "./Table/RedirectToPersistedDamLocation";

interface FolderProps extends DamConfig {
    filterApi: IFilterApi<DamFilter>;
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
    const [selectedFolderId, setSelectedFolderId] = React.useState<string | undefined>();
    const { data } = useQuery<GQLDamFolderQuery, GQLDamFolderQueryVariables>(damFolderQuery, {
        variables: {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            id: selectedFolderId!,
        },
        skip: selectedFolderId === undefined,
    });

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
                            <Button
                                variant="text"
                                color="inherit"
                                startIcon={<AddFolderIcon />}
                                onClick={() => {
                                    editDialogApi.openAddDialog(id);
                                }}
                            >
                                <FormattedMessage id="comet.pages.dam.addFolder" defaultMessage="Add Folder" />
                            </Button>
                            <UploadSplitButton
                                folderId={id}
                                filter={{
                                    allowedMimetypes: props.allowedMimetypes,
                                }}
                            />
                        </ToolbarActions>
                    </Toolbar>
                    <FolderTable id={id} breadcrumbs={stackApi?.breadCrumbs} selectionApi={selectionApi} filterApi={filterApi} {...props} />
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
    renderDamLabel?: (row: GQLDamFileTableFragment | GQLDamFolderTableFragment, options: { matches?: TextMatch[] }) => React.ReactNode;
    TableContainer?: ({ children }: { children: React.ReactNode }) => React.ReactElement;
    hideArchiveFilter?: boolean;
    hideContextMenu?: boolean;
    allowedMimetypes?: string[];
    contentScopeIndicator?: React.ReactNode;
    hideMultiselect?: boolean;
    hideDamActions?: boolean;
}

interface DamTableProps extends DamConfig {
    damLocationStorageKey?: string;
}

export const DamTable = ({ damLocationStorageKey, ...props }: DamTableProps): React.ReactElement => {
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
            <RedirectToPersistedDamLocation stateKey={damLocationStorageKey ?? "dam-location"}>
                <FileUploadContextProvider>
                    <ManualDuplicatedFilenamesHandlerContextProvider>
                        <Folder filterApi={filterApi} {...propsWithDefaultValues} />
                    </ManualDuplicatedFilenamesHandlerContextProvider>
                </FileUploadContextProvider>
            </RedirectToPersistedDamLocation>
        </Stack>
    );
};
