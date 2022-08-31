import { useQuery } from "@apollo/client";
import {
    EditDialogApiContext,
    IFilterApi,
    ISortInformation,
    messages,
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
    useTableQueryFilter,
} from "@comet/admin";
import { AddFolder as AddFolderIcon, Domain } from "@comet/admin-icons";
import { Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { TextMatch } from "../common/MarkedMatches";
import { ContentScopeIndicator } from "../contentScope/ContentScopeIndicator";
import { GQLDamFileTableFragment, GQLDamFolderQuery, GQLDamFolderQueryVariables, GQLDamFolderTableFragment } from "../graphql.generated";
import EditFile from "./FileForm/EditFile";
import { FileUploadContextProvider } from "./Table/fileUpload/FileUploadContext";
import { UploadSplitButton } from "./Table/fileUpload/UploadSplitButton";
import { DamTableFilter } from "./Table/filter/DamTableFilter";
import FolderTable from "./Table/FolderTable";
import { damFolderQuery } from "./Table/FolderTable.gql";
import { RedirectToPersistedDamLocation } from "./Table/RedirectToPersistedDamLocation";

const ScopeIndicatorLabelBold = styled(Typography)`
    && {
        font-weight: 400;
        padding: 0 8px 0 4px;
        text-transform: uppercase;
    }
`;

const ScopeIndicatorContent = styled("div")`
    display: flex;
    align-items: center;
`;

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
                    {!props.disableScopeIndicator && (
                        <ContentScopeIndicator variant="toolbar" global>
                            <ScopeIndicatorContent>
                                <Domain fontSize="small" />
                                <ScopeIndicatorLabelBold variant="body2">
                                    <FormattedMessage {...messages.globalContentScope} />
                                </ScopeIndicatorLabelBold>
                            </ScopeIndicatorContent>
                        </ContentScopeIndicator>
                    )}

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
    disableScopeIndicator?: boolean;
    hideMultiselect?: boolean;
    hideDamActions?: boolean;
}

interface DamTableProps extends DamConfig {
    damLocationStorageKey?: string;
}

export const DamTable = ({ damLocationStorageKey, ...props }: DamTableProps): React.ReactElement => {
    const intl = useIntl();

    const propsWithDefaultValues = {
        disableScopeIndicator: false,
        hideContextMenu: false,
        hideMultiselect: false,
        hideDamActions: false,
        hideArchiveFilter: false,
        ...props,
    };

    const filterApi = useTableQueryFilter<DamFilter>({
        sort: {
            columnName: "name",
            direction: SortDirection.ASC,
        },
        archived: false,
    });

    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "comet.pages.dam.assetManager", defaultMessage: "Asset Manager" })}>
            <RedirectToPersistedDamLocation stateKey={damLocationStorageKey ?? "dam-location"}>
                <FileUploadContextProvider>
                    <Folder filterApi={filterApi} {...propsWithDefaultValues} />
                </FileUploadContextProvider>
            </RedirectToPersistedDamLocation>
        </Stack>
    );
};
