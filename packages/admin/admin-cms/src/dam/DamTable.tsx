import { useQuery } from "@apollo/client";
import {
    EditDialogApiContext,
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
    useTableQueryFilter,
} from "@comet/admin";
import { Domain, Folder as FolderIcon } from "@comet/admin-icons";
import { Button, Typography } from "@material-ui/core";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import styled from "styled-components";

import { ContentScopeIndicator } from "../contentScope/ContentScopeIndicator";
import {
    GQLDamFileTableFragment,
    GQLDamFolderQuery,
    GQLDamFolderQueryVariables,
    GQLDamFolderTableFragment,
    GQLFileCategory,
} from "../graphql.generated";
import EditFile from "./FileForm/EditFile";
import { UploadSplitButton } from "./Table/fileUpload/UploadSplitButton";
import { DamTableFilter } from "./Table/filter/DamTableFilter";
import FolderTable from "./Table/FolderTable";
import { damFolderQuery } from "./Table/FolderTable.gql";

const ScopeIndicatorLabelBold = styled(Typography)`
    && {
        font-weight: 400;
        padding: 0 8px 0 4px;
        text-transform: uppercase;
    }
`;

const ScopeIndicatorContent = styled.div`
    display: flex;
    align-items: center;
`;

interface FolderProps extends DamConfig {
    id?: string;
}

export interface DamFilter {
    fileCategory?: GQLFileCategory;
    allowedMimetypes?: string[];
    searchText?: string;
    sort?: ISortInformation;
}

const Folder = ({ id, ...props }: FolderProps) => {
    const intl = useIntl();
    const stackApi = useStackApi();
    const [, , editDialogApi, selectionApi] = useEditDialog();

    const filterApi = useTableQueryFilter<DamFilter>({
        sort: {
            columnName: "name",
            direction: SortDirection.ASC,
        },
    });

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
                    <ContentScopeIndicator variant="toolbar" global>
                        <ScopeIndicatorContent>
                            <Domain fontSize="small" />
                            <ScopeIndicatorLabelBold variant="body2">
                                <FormattedMessage id="comet.generic.globalContentScope" defaultMessage="Global Content" />
                            </ScopeIndicatorLabelBold>
                        </ScopeIndicatorContent>
                    </ContentScopeIndicator>

                    <Toolbar>
                        <ToolbarItem>
                            <DamTableFilter filterApi={filterApi} />
                        </ToolbarItem>
                        <ToolbarFillSpace />
                        <ToolbarActions>
                            <Button
                                variant="text"
                                startIcon={<FolderIcon />}
                                onClick={() => {
                                    editDialogApi.openAddDialog(id);
                                }}
                            >
                                <FormattedMessage id="comet.pages.dam.addFolder" defaultMessage="Add Folder" />
                            </Button>
                            <UploadSplitButton
                                folderId={id}
                                filter={{
                                    fileCategory: props.fileCategory,
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
                    return <Folder id={selectedId} {...props} />;
                }}
            </StackPage>
        </StackSwitch>
    );
};

export interface DamConfig {
    renderDamLabel?: (row: GQLDamFileTableFragment | GQLDamFolderTableFragment) => React.ReactNode;
    TableContainer?: ({ children }: { children: React.ReactNode }) => React.ReactElement;
    hideContextMenu?: boolean;
    /** Filter files by category. Is overruled by allowedMimetypes. */
    fileCategory?: GQLFileCategory;
    /** Filter files by mimetype. Overrules fileCategory. */
    allowedMimetypes?: string[];
}

type DamTableProps = DamConfig;

export const DamTable = ({ ...props }: DamTableProps): React.ReactElement => {
    const intl = useIntl();

    const propsWithDefaultValues = { hideContextMenu: false, ...props };

    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "comet.pages.dam.assetManager", defaultMessage: "Asset Manager" })}>
            <Folder {...propsWithDefaultValues} />
        </Stack>
    );
};
