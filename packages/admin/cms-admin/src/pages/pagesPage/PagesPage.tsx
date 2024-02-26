import { useQuery } from "@apollo/client";
import {
    Alert,
    Loading,
    LocalErrorScopeApolloContext,
    MainContent,
    messages,
    Stack,
    StackPage,
    StackSwitch,
    Toolbar,
    ToolbarActions,
    useEditDialog,
    useFocusAwarePolling,
    useStoredState,
} from "@comet/admin";
import { Add } from "@comet/admin-icons";
import { Box, Button, Divider, FormControlLabel, LinearProgress, Paper, Switch } from "@mui/material";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ContentScopeInterface, createEditPageNode, useCmsBlockContext } from "../..";
import { useContentScope } from "../../contentScope/Provider";
import { useContentScopeConfig } from "../../contentScope/useContentScopeConfig";
import { DamScopeProvider } from "../../dam/config/DamScopeProvider";
import { DocumentInterface, DocumentType } from "../../documents/types";
import { useSiteConfig } from "../../sitesConfig/useSiteConfig";
import { EditPageNodeProps } from "../createEditPageNode";
import { PageSearch } from "../pageSearch/PageSearch";
import { usePageSearch } from "../pageSearch/usePageSearch";
import { PageTree, PageTreeRefApi } from "../pageTree/PageTree";
import { AllCategories, PageTreeContext } from "../pageTree/PageTreeContext";
import { usePageTree } from "../pageTree/usePageTree";
import { createPagesQuery, GQLPagesQuery, GQLPagesQueryVariables, GQLPageTreePageFragment } from "./createPagesQuery";
import { PagesPageActionToolbar } from "./PagesPageActionToolbar";

interface Props {
    category: string;
    path: string;
    allCategories: AllCategories;
    documentTypes: Record<DocumentType, DocumentInterface>;
    editPageNode?: React.ComponentType<EditPageNodeProps>;
    renderContentScopeIndicator: (scope: ContentScopeInterface) => React.ReactNode;
}

const DefaultEditPageNode = createEditPageNode({});

export function PagesPage({
    category,
    path,
    allCategories,
    documentTypes,
    editPageNode: EditPageNode = DefaultEditPageNode,
    renderContentScopeIndicator,
}: Props): React.ReactElement {
    const intl = useIntl();
    const { scope, setRedirectPathAfterChange } = useContentScope();
    const { additionalPageTreeNodeFragment } = useCmsBlockContext();
    useContentScopeConfig({ redirectPathAfterChange: path });

    const siteConfig = useSiteConfig({ scope });
    const pagesQuery = React.useMemo(() => createPagesQuery({ additionalPageTreeNodeFragment }), [additionalPageTreeNodeFragment]);

    React.useEffect(() => {
        setRedirectPathAfterChange(path);
        return () => {
            setRedirectPathAfterChange(undefined);
        };
    }, [setRedirectPathAfterChange, path]);

    const { loading, data, error, refetch, startPolling, stopPolling } = useQuery<GQLPagesQuery, GQLPagesQueryVariables>(pagesQuery, {
        fetchPolicy: "cache-and-network",
        variables: {
            contentScope: scope,
            category,
        },
        context: LocalErrorScopeApolloContext,
    });

    useFocusAwarePolling({
        pollInterval: process.env.NODE_ENV === "development" ? undefined : 10000,
        refetch,
        startPolling,
        stopPolling,
    });

    const isInitialLoad = React.useRef(true);

    if (error) {
        const isPollingError = !isInitialLoad.current;

        if (isPollingError) {
            // Ignore
        } else {
            throw error;
        }
    }

    if (isInitialLoad.current && !loading) {
        isInitialLoad.current = false;
    }

    const [EditDialog, editDialogSelection, editDialogApi] = useEditDialog();

    const refPageTree = React.useRef<PageTreeRefApi>(null);
    const [showArchive, setShowArchive] = useStoredState<boolean>("pageTreeShowArchive", false, window.sessionStorage);

    const ignorePages = React.useCallback((page: GQLPageTreePageFragment) => (showArchive ? true : page.visibility !== "Archived"), [showArchive]);

    const { tree, pagesToRender, setExpandedIds, expandedIds, toggleExpand, onSelectChanged, setSelectedIds, selectState, selectedTree } =
        usePageTree({
            pages: data?.pages ?? [],
            filter: ignorePages,
        });

    const pageSearchApi = usePageSearch({
        tree,
        pagesToRender,
        domain: scope.domain,
        setExpandedIds,
        onUpdateCurrentMatch: (pageId, pagesToRender) => {
            const index = pagesToRender.findIndex((c) => c.id === pageId);
            if (index !== -1) {
                refPageTree.current?.scrollToItem(index, "smart");
            }
        },
    });
    const { pagesToRenderWithMatches, query, setQuery } = pageSearchApi;

    function handleArchiveToggleClick() {
        setShowArchive((s) => !s);
    }

    return (
        <DamScopeProvider>
            <Stack topLevelTitle={intl.formatMessage({ id: "comet.pages.pages", defaultMessage: "Pages" })}>
                <StackSwitch>
                    <StackPage name="table">
                        {renderContentScopeIndicator(scope)}
                        <Toolbar>
                            <PageSearch query={query} onQueryChange={setQuery} pageSearchApi={pageSearchApi} />
                            <FormControlLabel
                                control={<Switch checked={showArchive} color="primary" onChange={handleArchiveToggleClick} />}
                                label={<FormattedMessage id="comet.pages.pages.archivedItems" defaultMessage="Archived items" />}
                            />
                            <ToolbarActions>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<Add />}
                                    onClick={() => {
                                        editDialogApi.openAddDialog();
                                    }}
                                >
                                    <FormattedMessage {...messages.add} />
                                </Button>
                            </ToolbarActions>
                        </Toolbar>
                        <PageTreeContext.Provider value={{ allCategories, currentCategory: category, documentTypes, tree, query: pagesQuery }}>
                            {/* @ts-expect-error TODO: fix types - `sx` is missing here for some reason */}
                            <MainContent fullHeight sx={{ display: "flex", flexDirection: "column" }}>
                                <Box sx={{ width: "100%", paddingLeft: 24, paddingRight: 50 }}>
                                    <PagesPageActionToolbar
                                        selectedState={selectState}
                                        onSelectAllPressed={() => {
                                            if (selectState === "nothing_selected" || selectState === "some_selected") {
                                                // select all pages
                                                if (data) {
                                                    setSelectedIds(data.pages.map((page) => page.id));
                                                }
                                            } else if (selectState === "all_selected") {
                                                // Unselect all
                                                setSelectedIds([]);
                                            }
                                        }}
                                        selectedTree={selectedTree}
                                        collapseAllDisabled={!expandedIds.length}
                                        onCollapseAllPressed={() => {
                                            setExpandedIds([]);
                                        }}
                                    />
                                </Box>
                                <Paper variant="outlined" sx={{ flex: 1 }}>
                                    {loading && isInitialLoad.current ? (
                                        <Loading behavior="fillParent" />
                                    ) : (
                                        <>
                                            <Divider />
                                            {loading && !isInitialLoad.current ? (
                                                <LinearProgress />
                                            ) : (
                                                /* Placeholder to avoid content jumping when the loading bar appears */
                                                <Box sx={{ backgroundColor: "white", width: "100%", height: 2 }} />
                                            )}
                                            <PageTree
                                                ref={refPageTree}
                                                pages={pagesToRenderWithMatches}
                                                editDialogApi={editDialogApi}
                                                toggleExpand={toggleExpand}
                                                onSelectChanged={onSelectChanged}
                                                category={category}
                                                siteUrl={siteConfig.url}
                                            />
                                        </>
                                    )}
                                </Paper>
                            </MainContent>
                        </PageTreeContext.Provider>

                        <EditDialog>
                            <EditPageNode
                                id={editDialogSelection.id || null}
                                mode={editDialogSelection.mode ?? "add"}
                                category={category}
                                documentTypes={documentTypes}
                            />
                        </EditDialog>
                    </StackPage>
                    <StackPage name="edit" title={intl.formatMessage({ id: "comet.pages.pages.editContent", defaultMessage: "Edit content" })}>
                        {(selectedId) => {
                            const page = data?.pages.find((page) => page.id == selectedId);

                            if (loading && isInitialLoad.current) {
                                return <Loading behavior="fillPageHeight" />;
                            }

                            if (!page) {
                                return (
                                    <MainContent>
                                        <Alert
                                            title={<FormattedMessage id="comet.pages.pages.notFound" defaultMessage="Not found" />}
                                            severity="error"
                                        >
                                            <FormattedMessage
                                                id="comet.pages.pages.documentDoesntExist"
                                                defaultMessage="This document doesn't exist"
                                            />
                                        </Alert>
                                    </MainContent>
                                );
                            }

                            if (page.visibility === "Archived") {
                                return (
                                    <MainContent>
                                        <Alert
                                            title={<FormattedMessage id="comet.pages.pages.archived" defaultMessage="Archived" />}
                                            severity="error"
                                        >
                                            <FormattedMessage
                                                id="comet.pages.pages.documentHasBeenArchived"
                                                defaultMessage="This document has been archived and can no longer be edited"
                                            />
                                        </Alert>
                                    </MainContent>
                                );
                            }

                            const documentType = documentTypes[page.documentType];

                            if (!documentType) {
                                return null;
                            }

                            const EditComponent = documentType.editComponent;

                            return EditComponent ? <EditComponent id={selectedId} category={category} /> : null;
                        }}
                    </StackPage>
                </StackSwitch>
            </Stack>
        </DamScopeProvider>
    );
}
