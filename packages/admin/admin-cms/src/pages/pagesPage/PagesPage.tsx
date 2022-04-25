import { useQuery } from "@apollo/client";
import { MainContent, Stack, StackPage, StackSwitch, Toolbar, ToolbarActions, useEditDialog, useStoredState } from "@comet/admin";
import { Add, Domain } from "@comet/admin-icons";
import { Box, Button, CircularProgress, FormControlLabel, Paper, Switch, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import withStyles from "@mui/styles/withStyles";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ContentScopeIndicator } from "../..";
import { useContentScope } from "../../contentScope/Provider";
import { useContentScopeConfig } from "../../contentScope/useContentScopeConfig";
import { DocumentInterface, DocumentType } from "../../documents/types";
import { GQLPagesQuery, GQLPagesQueryVariables, GQLPageTreeNodeCategory, GQLPageTreePageFragment } from "../../graphql.generated";
import { useSiteConfig } from "../../sitesConfig/useSiteConfig";
import { EditPageNode } from "../EditPageNode";
import { PageSearch } from "../pageSearch/PageSearch";
import { usePageSearch } from "../pageSearch/usePageSearch";
import { PageTree, PageTreeRefApi } from "../pageTree/PageTree";
import { AllCategories, PageTreeContext } from "../pageTree/PageTreeContext";
import { usePageTree } from "../pageTree/usePageTree";
import { PagesPageActionToolbar } from "./PagesPageActionToolbar";
import { pagesQuery } from "./pagesQuery";

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

const ScopeIndicatorLabel = styled(Typography)`
    && {
        padding-left: 8px;
        text-transform: uppercase;
    }
`;
interface Props {
    category: GQLPageTreeNodeCategory;
    path: string;
    allCategories: AllCategories;
    documentTypes: Record<DocumentType, DocumentInterface>;
}

export function PagesPage({ category, path, allCategories, documentTypes }: Props): React.ReactElement {
    const intl = useIntl();
    const { scope, setRedirectPathAfterChange } = useContentScope();
    useContentScopeConfig({ redirectPathAfterChange: path });

    const siteConfig = useSiteConfig({ scope });

    React.useEffect(() => {
        setRedirectPathAfterChange(path);
        return () => {
            setRedirectPathAfterChange(undefined);
        };
    }, [setRedirectPathAfterChange, path]);

    const { loading, data } = useQuery<GQLPagesQuery, GQLPagesQueryVariables>(pagesQuery, {
        variables: {
            contentScope: scope,
            category,
        },
        pollInterval: process.env.NODE_ENV === "development" ? undefined : 10000,
    });

    const [EditDialog, editDialogSelection, editDialogApi] = useEditDialog();

    const refPageTree = React.useRef<PageTreeRefApi>(null);
    const [showArchive, setShowArchive] = useStoredState<boolean>("pageTreeShowArchive", false, window.sessionStorage);

    const ignorePages = React.useCallback((page: GQLPageTreePageFragment) => (showArchive ? true : page.visibility !== "Archived"), [showArchive]);

    const { tree, pagesToRender, setExpandedIds, toggleExpand, onSelectChanged, setSelectedIds, selectState, selectedTree } = usePageTree({
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
        <Stack topLevelTitle={intl.formatMessage({ id: "comet.pages.pages", defaultMessage: "Pages" })}>
            <StackSwitch>
                <StackPage name="table">
                    <ContentScopeIndicator variant="toolbar">
                        <ScopeIndicatorContent>
                            <Domain fontSize="small" />
                            <ScopeIndicatorLabelBold variant="body2">{scope.domain}</ScopeIndicatorLabelBold>
                        </ScopeIndicatorContent>
                        {` | `}
                        <ScopeIndicatorLabel variant="body2">{scope.language}</ScopeIndicatorLabel>
                    </ContentScopeIndicator>
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
                                <FormattedMessage id="comet.generic.add" defaultMessage="Add" />
                            </Button>
                        </ToolbarActions>
                    </Toolbar>
                    <PageTreeContext.Provider value={{ allCategories, documentTypes, tree }}>
                        <FullHeightMainContent>
                            <ActionToolbarBox>
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
                                    onCollapseAllPressed={() => {
                                        setExpandedIds([]);
                                    }}
                                />
                            </ActionToolbarBox>

                            <FullHeightPaper variant="outlined">
                                {loading && <CircularProgress />}

                                <PageTree
                                    ref={refPageTree}
                                    pages={pagesToRenderWithMatches}
                                    editDialogApi={editDialogApi}
                                    toggleExpand={toggleExpand}
                                    onSelectChanged={onSelectChanged}
                                    category={category}
                                    siteUrl={siteConfig.url}
                                />
                            </FullHeightPaper>
                        </FullHeightMainContent>
                    </PageTreeContext.Provider>

                    <EditDialog>
                        {editDialogSelection.mode && (
                            <EditPageNode
                                mode={editDialogSelection.mode}
                                id={editDialogSelection.id || null}
                                category={category}
                                documentTypes={documentTypes}
                            />
                        )}
                    </EditDialog>
                </StackPage>
                <StackPage name="edit" title={intl.formatMessage({ id: "comet.pages.pages.editContent", defaultMessage: "Edit content" })}>
                    {(selectedId) => {
                        const page = data?.pages.find((page) => page.id == selectedId);

                        if (!page) {
                            return null;
                        }

                        if (page.visibility === "Archived") {
                            return <>403, not allowed</>;
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
    );
}

const FullHeightMainContent = withStyles({
    root: {
        height: "calc(100vh - 140px)",
        display: "flex",
        flexDirection: "column",
    },
})(MainContent);

const FullHeightPaper = withStyles({
    root: {
        flex: 1,
    },
})(Paper);

const ActionToolbarBox = withStyles({
    root: {
        width: "100%",
        paddingLeft: 24,
        paddingRight: 50,
    },
})(Box);
