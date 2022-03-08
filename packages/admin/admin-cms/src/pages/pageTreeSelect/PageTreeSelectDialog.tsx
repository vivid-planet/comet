import { gql, useQuery } from "@apollo/client";
import { Select, Toolbar, ToolbarActions, ToolbarFillSpace } from "@comet/admin";
import { ArrowRight, Close, Delete } from "@comet/admin-icons";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, makeStyles, MenuItem, TableRow } from "@material-ui/core";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { FixedSizeList as List } from "react-window";
import styled from "styled-components";

import { useContentScope } from "../../contentScope/Provider";
import {
    GQLPagesQuery,
    GQLPagesQueryVariables,
    GQLPageTreeNodeCategory,
    GQLPageTreePageFragment,
    GQLSelectedPageFragment,
} from "../../graphql.generated";
import { PageSearch } from "../pageSearch/PageSearch";
import { usePageSearch } from "../pageSearch/usePageSearch";
import { pagesQuery } from "../pagesPage/pagesQuery";
import PageInfo from "../pageTree/PageInfo";
import { AllCategories } from "../pageTree/PageTreeContext";
import * as sc from "../pageTree/PageTreeRow.sc";
import { PageTreeRowDivider } from "../pageTree/PageTreeRowDivider";
import { PageVisibilityIcon } from "../pageTree/PageVisibilityIcon";
import { PageTreePage, usePageTree } from "../pageTree/usePageTree";
import PageSelectButton from "./PageSelectButton";

export const selectedPageFragment = gql`
    fragment SelectedPage on PageTreeNode {
        id
        name
        path
    }
`;

const StyledDialogTitle = styled(DialogTitle)`
    & > .MuiTypography-root {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }
`;

const StyledDialogAction = styled(DialogActions)`
    & > :first-child:last-child {
        margin-left: initial;
    }
`;

const PageSearchContainer = styled.div`
    display: flex;
    padding: 15px;
    width: 100%;
    padding-left: 0;
`;

interface PageTreeSelectProps {
    allCategories?: AllCategories;
    value: GQLSelectedPageFragment | undefined | null;
    onChange: (newValue: GQLSelectedPageFragment | null) => void;
    open: boolean;
    onClose: () => void;
    defaultCategory: GQLPageTreeNodeCategory;
}

const useStyles = makeStyles({
    dialogPaper: {
        minHeight: "80vh",
        maxHeight: "80vh",
    },
});

export default function PageTreeSelectDialog({ allCategories, value, onChange, open, onClose, defaultCategory }: PageTreeSelectProps): JSX.Element {
    const { scope } = useContentScope();
    const [category, setCategory] = React.useState<GQLPageTreeNodeCategory>(defaultCategory);
    const refList = React.useRef<List>(null);
    const [height, setHeight] = React.useState(200);
    const refDialogContent = React.useRef<HTMLDivElement>(null);
    const selectedPageId = value?.id;
    const classes = useStyles();

    // Fetch data
    const { data } = useQuery<GQLPagesQuery, GQLPagesQueryVariables>(pagesQuery, {
        variables: {
            contentScope: scope,
            category,
        },
        pollInterval: process.env.NODE_ENV === "development" ? undefined : 10000,
        skip: !open,
    });

    // Exclude all archived pages from selectables, except if the selected page itself is archived
    const ignorePages = React.useCallback((page: GQLPageTreePageFragment) => page.id === selectedPageId || page.visibility !== "Archived", [
        selectedPageId,
    ]);

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

    return (
        <Dialog
            classes={{ paper: classes.dialogPaper }}
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="xl"
            onEnter={handelOnEnterDialog}
            onEntered={handelOnEnteredDialog}
        >
            <StyledDialogTitle>
                <FormattedMessage id="comet.pages.pageTreeSelect.label" defaultMessage="Select Page" />
                <IconButton onClick={onClose} color="inherit">
                    <Close fontSize="medium" />
                </IconButton>
            </StyledDialogTitle>
            <Toolbar>
                <ToolbarActions>
                    {allCategories && (
                        <Select
                            value={category}
                            onChange={(event) => {
                                setCategory(event.target.value as GQLPageTreeNodeCategory);
                            }}
                        >
                            {allCategories.map(({ category, label }) => (
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
                <List
                    ref={refList}
                    height={height}
                    itemCount={pagesToRenderWithMatches.length}
                    width="100%"
                    itemSize={listItemSize}
                    style={{ background: "white" }}
                >
                    {({ index, style }) => {
                        const page = pagesToRenderWithMatches[index];
                        return (
                            <Row
                                key={page.id}
                                virtualizedStyle={{
                                    ...style,
                                }}
                                page={page}
                                toggleExpand={toggleExpand}
                                selected={page.id === value?.id}
                                onSelect={() => {
                                    onChange({ id: page.id, name: page.name, path: page.path });
                                    onClose();
                                }}
                            />
                        );
                    }}
                </List>
            </DialogContent>
            <StyledDialogAction>
                {value && (
                    <Button
                        onClick={() => {
                            onChange(null);
                            onClose();
                        }}
                        startIcon={<Delete />}
                    >
                        <FormattedMessage id="comet.pages.pageTreeSelect.removeSelection" defaultMessage="Remove Selection" />
                    </Button>
                )}
            </StyledDialogAction>
        </Dialog>
    );
}

const PageVisibility = styled.div`
    display: flex;
    & :first-child {
        margin-right: 5px;
    }
    align-items: center;
`;
interface RowProps {
    page: PageTreePage;
    toggleExpand: (pageId: string) => void;
    virtualizedStyle?: React.CSSProperties;
    selected: boolean;
    onSelect: () => void;
}
function Row({ page, toggleExpand, virtualizedStyle, onSelect, selected }: RowProps) {
    const [hover, setHover] = React.useState(false);
    const classes = sc.useStyles({
        isDragHovered: false,
        isMouseHovered: hover,
        isSelected: selected || page.selected,
        isArchived: page.visibility === "Archived",
    });

    const handleRowClick = () => {
        if (page.documentType !== "Link") {
            onSelect();
        }
    };

    return (
        <TableRow
            style={virtualizedStyle}
            component="div"
            classes={{ root: classes.root }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onMouseMove={() => {
                if (!hover) {
                    setHover(true);
                }
            }}
        >
            <PageTreeRowDivider align="top" leftSpacing={0} highlight={false} />
            <sc.PageTreeCell component="div">
                <PageInfo page={page} toggleExpand={toggleExpand}>
                    <PageSelectButton page={page} onClick={handleRowClick} />
                </PageInfo>
            </sc.PageTreeCell>
            <sc.PageTreeCell component="div">
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
            </sc.PageTreeCell>
            <sc.PageTreeCell component="div" align="right">
                <ArrowRight />
            </sc.PageTreeCell>
            <sc.RowClickContainer onClick={handleRowClick} />
            <PageTreeRowDivider align="bottom" leftSpacing={0} highlight={false} />
        </TableRow>
    );
}
