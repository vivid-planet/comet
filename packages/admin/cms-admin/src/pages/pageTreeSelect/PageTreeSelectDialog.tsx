import { gql, useQuery } from "@apollo/client";
import { Toolbar, ToolbarActions, ToolbarFillSpace, useFocusAwarePolling } from "@comet/admin";
import { ArrowRight, Close, Delete } from "@comet/admin-icons";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Select } from "@mui/material";
import { styled } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";

import { useCmsBlockContext } from "../../blocks/useCmsBlockContext";
import { useContentScope } from "../../contentScope/Provider";
import { Maybe } from "../../graphql.generated";
import { PageSearch } from "../pageSearch/PageSearch";
import { usePageSearch } from "../pageSearch/usePageSearch";
import { createPagesQuery, GQLPagesQuery, GQLPagesQueryVariables, GQLPageTreePageFragment } from "../pagesPage/createPagesQuery";
import { PageTreeTableRow } from "../pageTree/common/PageTreeTableRow";
import PageInfo from "../pageTree/PageInfo";
import PageLabel from "../pageTree/PageLabel";
import { PageTreeContext } from "../pageTree/PageTreeContext";
import { PageTreeRowDivider } from "../pageTree/PageTreeRowDivider";
import { PageVisibilityIcon } from "../pageTree/PageVisibilityIcon";
import { PageTreePage, usePageTree } from "../pageTree/usePageTree";
import { GQLSelectedPageFragment } from "./PageTreeSelectDialog.generated";
import * as sc from "./PageTreeSelectDialog.sc";

export { GQLSelectedPageFragment } from "./PageTreeSelectDialog.generated";

export const selectedPageFragment = gql`
    fragment SelectedPage on PageTreeNode {
        id
        name
        path
        documentType
    }
`;

const StyledDialogTitle = styled(DialogTitle)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
`;

const CloseButton = styled(IconButton)`
    position: absolute;
    right: ${({ theme }) => theme.spacing(2)};
`;

const StyledDialogAction = styled(DialogActions)`
    & > :first-of-type:last-child {
        margin-left: initial;
    }
`;

const PageSearchContainer = styled("div")`
    display: flex;
    padding: 15px;
    width: 100%;
    padding-left: 0;
`;

interface PageTreeSelectProps {
    value: GQLSelectedPageFragment | undefined | null;
    onChange: (newValue: GQLSelectedPageFragment | null) => void;
    open: boolean;
    onClose: () => void;
    defaultCategory: string;
}

const useStyles = makeStyles({
    dialogPaper: {
        minHeight: "80vh",
        maxHeight: "80vh",
    },
});

export default function PageTreeSelectDialog({ value, onChange, open, onClose, defaultCategory }: PageTreeSelectProps): JSX.Element {
    const { pageTreeCategories, pageTreeDocumentTypes, additionalPageTreeNodeFragment } = useCmsBlockContext();
    const { scope } = useContentScope();
    const [category, setCategory] = React.useState<string>(defaultCategory);
    const refList = React.useRef<List>(null);
    const [height, setHeight] = React.useState(200);
    const refDialogContent = React.useRef<HTMLDivElement>(null);
    const selectedPageId = value?.id;
    const classes = useStyles();

    const pagesQuery = React.useMemo(() => createPagesQuery({ additionalPageTreeNodeFragment }), [additionalPageTreeNodeFragment]);

    // Fetch data
    const { data, refetch, startPolling, stopPolling } = useQuery<GQLPagesQuery, GQLPagesQueryVariables>(pagesQuery, {
        variables: {
            contentScope: scope,
            category,
        },
        skip: !open,
    });

    useFocusAwarePolling({
        pollInterval: process.env.NODE_ENV === "development" ? undefined : 10000,
        skip: !open,
        refetch,
        startPolling,
        stopPolling,
    });

    // Exclude all archived pages from selectables, except if the selected page itself is archived
    const ignorePages = React.useCallback(
        (page: GQLPageTreePageFragment) => page.id === selectedPageId || page.visibility !== "Archived",
        [selectedPageId],
    );

    const { tree, pagesToRender, setExpandedIds, toggleExpand, expandPage } = usePageTree({
        pages: data?.pages || [],
        storageKeyExpandedIds: false,
        filter: ignorePages,
    });

    // Setup search
    const pageSearchApi = usePageSearch({
        tree,
        pagesToRender,
        domain: scope.domain,
        setExpandedIds,
        onUpdateCurrentMatch: (pageId, pagesToRender) => {
            const index = pagesToRender.findIndex((c) => c.id === pageId);

            if (index !== -1) {
                refList.current?.scrollToItem(index, "smart");
            }
        },
    });

    const handelOnEnterDialog = React.useCallback(() => {
        // Sets height of virtual list to a maximum
        if (refDialogContent.current) {
            const dialogContentInnerStyle = window.getComputedStyle(refDialogContent.current, null);
            const height =
                refDialogContent.current.clientHeight -
                parseInt(dialogContentInnerStyle.paddingTop) -
                parseInt(dialogContentInnerStyle.paddingBottom);
            setHeight(Math.max(200, height));
        }

        // Expand all parents of selected,
        // this must be done before we scroll to the selected page, so we can be sure the selected page is rendered
        if (selectedPageId) {
            expandPage(selectedPageId);
        }
    }, [selectedPageId, expandPage]);

    const handelOnEnteredDialog = React.useCallback(() => {
        // When the selected page is expanded we scroll to the selected page
        if (selectedPageId) {
            const index = pagesToRender.findIndex((c) => c.id === selectedPageId);
            if (index) {
                refList.current?.scrollToItem(index, "smart");
            }
        }
    }, [selectedPageId, pagesToRender]);

    const listItemSize = 54;

    const { pagesToRenderWithMatches, query, setQuery } = pageSearchApi;

    const handleSelect = React.useCallback(
        (page: PageTreePage) => {
            onChange({ id: page.id, name: page.name, path: page.path, documentType: page.documentType });
            onClose();
        },
        [onChange, onClose],
    );

    const itemData = React.useMemo<ItemData>(
        () => ({
            pages: pagesToRenderWithMatches,
            toggleExpand,
            onSelect: handleSelect,
            selectedPage: value,
        }),
        [pagesToRenderWithMatches, toggleExpand, handleSelect, value],
    );

    return (
        <Dialog
            classes={{ paper: classes.dialogPaper }}
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="xl"
            TransitionProps={{
                onEnter: handelOnEnterDialog,
                onEntered: handelOnEnteredDialog,
            }}
        >
            <StyledDialogTitle>
                <FormattedMessage id="comet.pages.pageTreeSelect.label" defaultMessage="Select Page" />
                <CloseButton onClick={onClose} color="inherit">
                    <Close />
                </CloseButton>
            </StyledDialogTitle>
            <Toolbar>
                <ToolbarActions>
                    {pageTreeCategories && (
                        <Select
                            value={category}
                            onChange={(event) => {
                                setCategory(event.target.value as string);
                            }}
                        >
                            {pageTreeCategories.map(({ category, label }) => (
                                <MenuItem key={category} value={category}>
                                    {label}
                                </MenuItem>
                            ))}
                        </Select>
                    )}
                </ToolbarActions>
                <ToolbarFillSpace />
                <PageSearchContainer>
                    <PageSearch query={query} onQueryChange={setQuery} pageSearchApi={pageSearchApi} />
                </PageSearchContainer>
            </Toolbar>
            <DialogContent ref={refDialogContent}>
                <PageTreeContext.Provider
                    value={{
                        allCategories: pageTreeCategories,
                        currentCategory: category,
                        documentTypes: pageTreeDocumentTypes,
                        tree,
                        query: pagesQuery,
                    }}
                >
                    <List
                        ref={refList}
                        height={height}
                        itemCount={pagesToRenderWithMatches.length}
                        itemData={itemData}
                        width="100%"
                        itemSize={listItemSize}
                        style={{ background: "white" }}
                    >
                        {Row}
                    </List>
                </PageTreeContext.Provider>
            </DialogContent>
            <StyledDialogAction>
                {value && (
                    <Button
                        onClick={() => {
                            onChange(null);
                            onClose();
                        }}
                        startIcon={<Delete />}
                        color="info"
                    >
                        <FormattedMessage id="comet.pages.pageTreeSelect.removeSelection" defaultMessage="Remove Selection" />
                    </Button>
                )}
            </StyledDialogAction>
        </Dialog>
    );
}

const PageVisibility = styled("div")`
    display: flex;
    & :first-of-type {
        margin-right: 5px;
    }
    align-items: center;
`;

interface ItemData {
    pages: PageTreePage[];
    toggleExpand: (pageId: string) => void;
    selectedPage?: Maybe<GQLSelectedPageFragment>;
    onSelect: (page: PageTreePage) => void;
}

const Row = React.memo(({ index, style, data: { pages, selectedPage, toggleExpand, onSelect } }: ListChildComponentProps<ItemData>) => {
    const [hover, setHover] = React.useState(false);

    const page = pages[index];

    const handleRowClick = () => {
        if (page.documentType !== "Link") {
            onSelect(page);
        }
    };

    const disabled = page.visibility === "Archived" || page.documentType === "Link";

    return (
        <PageTreeTableRow
            isDragHovered={false}
            isMouseHovered={hover}
            isSelected={page.id === selectedPage?.id || page.selected}
            isArchived={page.visibility === "Archived"}
            clickable={page.visibility !== "Archived"}
            disabled={disabled}
            style={style}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onMouseMove={() => {
                if (!hover) {
                    setHover(true);
                }
            }}
        >
            <PageTreeRowDivider align="top" leftSpacing={0} highlight={false} />
            <sc.PageInfoCell component="div" title={page.name}>
                <PageInfo page={page} toggleExpand={toggleExpand}>
                    <PageLabel page={page} onClick={handleRowClick} disabled={disabled} />
                </PageInfo>
            </sc.PageInfoCell>
            <sc.PageVisibilityCell component="div">
                <PageVisibility>
                    <PageVisibilityIcon visibility={page.visibility} />
                    <FormattedMessage
                        id="comet.pages.pages.page.visibility"
                        defaultMessage="{visibility, select, visible {Published} hidden {Unpublished} archived {Archived} other {unknown}}"
                        values={{
                            visibility: page.visibility === "Published" ? "visible" : page.visibility === "Unpublished" ? "hidden" : "archived",
                        }}
                    />
                </PageVisibility>
            </sc.PageVisibilityCell>
            <sc.PageTreeCell component="div" align="right">
                <ArrowRight />
            </sc.PageTreeCell>
            <sc.RowClickContainer onClick={handleRowClick} />
            <PageTreeRowDivider align="bottom" leftSpacing={0} highlight={false} />
        </PageTreeTableRow>
    );
});
