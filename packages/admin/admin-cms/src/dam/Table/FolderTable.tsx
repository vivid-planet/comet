import { useApolloClient, useQuery } from "@apollo/client";
import {
    BreadcrumbItem,
    EditDialog,
    IFilterApi,
    ISelectionApi,
    ITableColumn,
    LocalErrorScopeApolloContext,
    MainContent,
    PrettyBytes,
    Table,
    TableColumns,
    TableQuery,
    useTableQuery,
} from "@comet/admin";
import { StackLink } from "@comet/admin/lib/stack/StackLink";
import { CircularProgress, Link, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { useDrop } from "react-dnd";
import { NativeTypes } from "react-dnd-html5-backend";
import { useDropzone } from "react-dropzone";
import { FormattedDate, FormattedMessage, FormattedTime, useIntl } from "react-intl";
import { useDebouncedCallback, useThrottledCallback } from "use-debounce";

import {
    GQLDamFilesListQuery,
    GQLDamFilesListQueryVariables,
    GQLDamFileTableFragment,
    GQLDamFolderQuery,
    GQLDamFolderQueryVariables,
    GQLDamFoldersListQuery,
    GQLDamFoldersListQueryVariables,
    GQLDamFolderTableFragment,
} from "../../graphql.generated";
import { DamConfig, DamFilter } from "../DamTable";
import AddFolder from "../FolderForm/AddFolder";
import EditFolder from "../FolderForm/EditFolder";
import FolderBreadcrumbs from "./breadcrumbs/FolderBreadcrumbs";
import DamContextMenu from "./DamContextMenu";
import { DamDnDFooter, FooterType } from "./DamDnDFooter";
import DamLabel from "./DamLabel";
import { acceptedMimeTypes, acceptedMimeTypesByCategory } from "./fileUpload/acceptedMimeTypes";
import { useFileUpload } from "./fileUpload/useFileUpload";
import { damFilesListQuery, damFolderQuery, damFoldersListQuery } from "./FolderTable.gql";
import FolderTableDragLayer from "./FolderTableDragLayer";
import { FolderTableRow, isFile, isFolder } from "./FolderTableRow";
import { useDamSearchHighlighting } from "./useDamSearchHighlighting";

const TableWrapper = styled("div")`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    min-height: 80vh;
    margin-bottom: 70px;
`;

interface TableHoverHighlightProps {
    $isHovered?: boolean;
}

const TableHoverHighlight = styled("div")<TableHoverHighlightProps>`
    flex-grow: 1;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    // hover styling
    outline: ${({ theme, $isHovered }) => ($isHovered ? `solid 1px ${theme.palette.primary.main}` : "none")};
    background: ${({ $isHovered }) => ($isHovered ? "rgba(41,182,246,0.1)" : "#fff")};

    & .CometFilesTableWrapper-root {
        background: ${({ $isHovered }) => ($isHovered ? "transparent" : "#fff")};
    }
`;

const FilesTableWrapper = styled("div")`
    min-height: 58px;
    flex-grow: 1;
    background-color: white;
`;

const BoldTypography = styled(Typography)`
    font-weight: 500;
`;

interface FolderTableProps extends DamConfig {
    id?: string;
    breadcrumbs?: BreadcrumbItem[];
    filterApi: IFilterApi<DamFilter>;
    selectionApi: ISelectionApi;
}

const FolderTable = ({
    id,
    filterApi,
    breadcrumbs,
    selectionApi,
    hideContextMenu,
    renderDamLabel,
    TableContainer: ConfigTableContainer,
    ...props
}: FolderTableProps): React.ReactElement => {
    const client = useApolloClient();
    const intl = useIntl();

    const [isHovered, setIsHovered] = React.useState<boolean>(false);
    const [footerType, setFooterType] = React.useState<FooterType>();
    const [footerFolderName, setFooterFolderName] = React.useState<string>();

    const fileCategoryMimetypes = props.fileCategory ? acceptedMimeTypesByCategory[props.fileCategory] : undefined;
    const {
        uploadFiles,
        dialogs: fileUploadDialogs,
        dropzoneConfig,
    } = useFileUpload({
        acceptedMimetypes: props.allowedMimetypes ?? fileCategoryMimetypes ?? acceptedMimeTypes,
        onAfterUpload: () => {
            client.reFetchObservableQueries();
        },
    });

    const showFooter = useThrottledCallback((type: FooterType, folderName?: string) => {
        setFooterType(type);
        setFooterFolderName(folderName);
    }, 500);

    const hideFooter = () => {
        if (showFooter.pending()) {
            showFooter.cancel();
        }
        setFooterType(undefined);
        setFooterFolderName(undefined);
    };

    const showHoverStyles = useDebouncedCallback(
        () => {
            setIsHovered(true);
        },
        500,
        { leading: true },
    );

    const hideHoverStyles = () => {
        if (showHoverStyles.pending()) {
            showHoverStyles.cancel();
        }
        setIsHovered(false);
    };

    const { data } = useQuery<GQLDamFolderQuery, GQLDamFolderQueryVariables>(damFolderQuery, {
        variables: {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            id: id!,
        },
        skip: id === undefined,
    });

    const {
        tableData: filesTableData,
        api: filesApi,
        loading: filesLoading,
        error: filesError,
    } = useTableQuery<GQLDamFilesListQuery, GQLDamFilesListQueryVariables>()(damFilesListQuery, {
        variables: {
            folderId: id,
            fileFilter: {
                category: props.fileCategory,
                mimetypes: props.allowedMimetypes,
                searchText: filterApi.current.searchText,
            },
            sort: filterApi.current.sort,
        },
        resolveTableData: ({ damFilesList }) => {
            return {
                data: damFilesList,
                totalCount: damFilesList.length,
            };
        },
        fetchPolicy: "cache-and-network",
        context: LocalErrorScopeApolloContext,
        notifyOnNetworkStatusChange: true,
    });

    const {
        tableData: foldersTableData,
        api: foldersApi,
        loading: foldersLoading,
        error: foldersError,
    } = useTableQuery<GQLDamFoldersListQuery, GQLDamFoldersListQueryVariables>()(damFoldersListQuery, {
        variables: {
            parentId: id,
            folderFilter: {
                searchText: filterApi.current.searchText,
            },
            sort: filterApi.current.sort,
        },
        resolveTableData: ({ damFoldersList }) => {
            return {
                data: damFoldersList,
                totalCount: damFoldersList.length,
            };
        },
        fetchPolicy: "cache-and-network",
        context: LocalErrorScopeApolloContext,
        notifyOnNetworkStatusChange: true,
    });

    const { matches } = useDamSearchHighlighting({
        items: [...(foldersTableData?.data || []), ...(filesTableData?.data || [])],
        query: filterApi.current.searchText ?? "",
    });

    const isSearching = !!(filterApi.current.searchText && filterApi.current.searchText.length > 0);

    const TableContainer = ConfigTableContainer ?? MainContent;

    const tableColumns: ITableColumn<GQLDamFileTableFragment | GQLDamFolderTableFragment>[] = [
        {
            name: "name",
            header: intl.formatMessage({
                id: "comet.dam.file.name",
                defaultMessage: "Name",
            }),
            cellProps: { style: { width: "100%" } },
            render: (row) => {
                return renderDamLabel ? (
                    renderDamLabel(row, { matches: matches.get(row.id) })
                ) : (
                    <Link
                        underline="none"
                        component={StackLink}
                        pageName={isFile(row) ? "edit" : "folder"}
                        payload={row.id}
                        onClick={() => {
                            if (isFolder(row)) {
                                filterApi.formApi.change("searchText", "");
                            }
                        }}
                    >
                        <DamLabel asset={row} showPath={isSearching} matches={matches.get(row.id)} />
                    </Link>
                );
            },
        },
        {
            name: "size",
            header: intl.formatMessage({
                id: "comet.dam.file.size",
                defaultMessage: "Size",
            }),
            cellProps: { style: { whiteSpace: "nowrap", textAlign: "right" } },
            render: (row) => {
                if (isFile(row)) {
                    return <PrettyBytes value={row.size} />;
                } else {
                    return `${row.numberOfFiles + row.numberOfChildFolders} items`;
                }
            },
        },
        {
            name: "updatedAt",
            header: "",
            cellProps: { style: { whiteSpace: "nowrap" } },
            render: (row) => (
                <div>
                    <FormattedDate value={row.updatedAt} day="2-digit" month="2-digit" year="numeric" />
                    {", "}
                    <FormattedTime value={row.updatedAt} />
                </div>
            ),
        },
    ];

    if (!hideContextMenu) {
        tableColumns.push({
            name: "contextMenu",
            header: "",
            render: (row) => {
                return isFile(row) ? <DamContextMenu file={row} /> : <DamContextMenu folder={row} />;
            },
        });
    }

    // // handles upload of native file (e.g. file from desktop) to current folder:
    // // If the native file is dropped on a file row in the table, it is uploaded
    // // to the current folder
    const { getRootProps: getFileRootProps } = useDropzone({
        ...dropzoneConfig,
        onDragEnter: () => {
            showHoverStyles.callback();
            showFooter.callback("upload", data?.damFolder.name);
        },
        onDragLeave: () => {
            hideHoverStyles();
            hideFooter();
        },
        onDrop: async (acceptedFiles: File[], rejectedFiles: File[]) => {
            hideHoverStyles();
            hideFooter();
            await uploadFiles({ acceptedFiles, rejectedFiles }, data?.damFolder.id);
        },
    });

    // hide footer and hover styling when leaving the TableWrapper
    const [{ isOver }, dropTargetRef] = useDrop({
        accept: [NativeTypes.FILE, "folder", "asset"],
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    });

    React.useEffect(() => {
        if (!isOver) {
            hideFooter();
            hideHoverStyles();
        }
        // only execute this when isOver changes, otherwise there are side effects
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOver]);

    if (filesTableData === undefined || foldersTableData === undefined) {
        return <CircularProgress />;
    }

    return (
        <>
            <TableContainer>
                <FolderTableDragLayer />
                <TableWrapper ref={dropTargetRef}>
                    <TableHead
                        isSearching={isSearching}
                        numberItems={foldersTableData.totalCount + filesTableData.totalCount}
                        breadcrumbs={breadcrumbs}
                        folderData={data}
                    />
                    <TableHoverHighlight $isHovered={isHovered}>
                        <TableQuery api={foldersApi} loading={foldersLoading} error={foldersError}>
                            <Table<GQLDamFolderTableFragment>
                                hideTableHead
                                {...foldersTableData}
                                columns={tableColumns}
                                renderTableRow={({ columns, row, rowProps }) => {
                                    return (
                                        <FolderTableRow
                                            key={row.id}
                                            dropTargetItem={row}
                                            rowProps={rowProps}
                                            footerApi={{ show: showFooter.callback, hide: hideFooter }}
                                            {...props}
                                        >
                                            <TableColumns columns={columns} row={row} />
                                        </FolderTableRow>
                                    );
                                }}
                            />
                        </TableQuery>

                        <FilesTableWrapper className="CometFilesTableWrapper-root" {...getFileRootProps()}>
                            <TableQuery api={filesApi} loading={filesLoading} error={filesError}>
                                <Table<GQLDamFileTableFragment>
                                    hideTableHead
                                    {...filesTableData}
                                    columns={tableColumns}
                                    renderTableRow={({ columns, row, rowProps }) => {
                                        return (
                                            <FolderTableRow
                                                key={row.id}
                                                dropTargetItem={row}
                                                rowProps={rowProps}
                                                footerApi={{ show: showFooter.callback, hide: hideFooter }}
                                                {...props}
                                            >
                                                <TableColumns columns={columns} row={row} />
                                            </FolderTableRow>
                                        );
                                    }}
                                />
                            </TableQuery>
                        </FilesTableWrapper>
                    </TableHoverHighlight>
                </TableWrapper>
                <EditDialog>
                    {({ selectedId, selectionMode }) => {
                        return (
                            <>
                                {selectionMode === "add" && <AddFolder parentId={selectedId} selectionApi={selectionApi} />}
                                {selectionMode === "edit" && <EditFolder id={selectedId as string} selectionApi={selectionApi} />}
                            </>
                        );
                    }}
                </EditDialog>
                <DamDnDFooter type={footerType} open={footerType !== undefined} folderName={footerFolderName} />
            </TableContainer>
            {fileUploadDialogs}
        </>
    );
};

interface TableHeadProps {
    isSearching: boolean;
    numberItems?: number;
    breadcrumbs?: BreadcrumbItem[];
    folderData?: GQLDamFolderQuery;
}

const TableHeadWrapper = styled("div")`
    min-height: 51px;
    padding: 15px 12px;
    background-color: white;
    border-top: 1px solid ${({ theme }) => theme.palette.grey[100]};
    border-bottom: 1px solid ${({ theme }) => theme.palette.grey[100]};
`;

const TableHead = ({ isSearching, numberItems, breadcrumbs, folderData }: TableHeadProps): React.ReactElement => {
    let content: React.ReactNode = null;

    if (isSearching) {
        content = (
            <BoldTypography variant="body1">
                <FormattedMessage
                    id="comet.pages.dam.foundNumberItems"
                    defaultMessage="Found {number} items"
                    values={{
                        number: numberItems,
                    }}
                />
            </BoldTypography>
        );
    } else if (breadcrumbs) {
        const folderIds: Array<string | null> = [null];
        if (folderData) {
            folderIds.push(...folderData.damFolder.mpath);
            folderIds.push(folderData.damFolder.id);
        }

        content = <FolderBreadcrumbs breadcrumbs={breadcrumbs} folderIds={folderIds} />;
    }

    return <TableHeadWrapper>{content}</TableHeadWrapper>;
};

export default FolderTable;
