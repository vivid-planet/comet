import { useApolloClient } from "@apollo/client";
import { IEditDialogApi, messages, StackSwitchApiContext } from "@comet/admin";
import { Add, Copy, Delete, Domain, Edit, MoreVertical, Paste, Settings, ThreeDotSaving } from "@comet/admin-icons";
import { writeClipboard } from "@comet/blocks-admin";
import { IconButton, ListItemIcon, ListItemText, Menu as MUIMenu, MenuItem } from "@mui/material";
import { styled } from "@mui/material/styles";
import withStyles from "@mui/styles/withStyles";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { serializeInitialValues } from "../../form/serializeInitialValues";
import {
    GQLDeletePageTreeNodeMutation,
    GQLDeletePageTreeNodeMutationVariables,
    GQLPageTreePageFragment,
    namedOperations,
} from "../../graphql.generated";
import { MovePageMenuItem } from "./MovePageMenuItem";
import { deletePageMutation } from "./Page.gql";
import { PageDeleteDialog } from "./PageDeleteDialog";
import { subTreeFromNode, traverse, treeMapToArray } from "./treemap/TreeMapUtils";
import { useCopyPastePages } from "./useCopyPastePages";
import { PageTreePage } from "./usePageTree";
import { usePageTreeContext } from "./usePageTreeContext";

interface PageContextMenuProps {
    page: PageTreePage;
    editDialog: IEditDialogApi | null;
    siteUrl: string;
}

const MenuItemSeparator = styled("div")`
    height: 1px;
    width: 100%;
    background-color: ${(props) => props.theme.palette.grey["100"]};
`;

const Menu = withStyles({
    paper: {
        minWidth: 280,
    },
})(MUIMenu);

const PageContextMenu = (props: PageContextMenuProps): React.ReactElement => {
    const [copyLoading, setCopyLoading] = React.useState(false);
    const [pasting, setPasting] = React.useState(false);
    const [duplicateLoading, setDuplicateLoading] = React.useState(false);

    const { prepareForClipboard, writeToClipboard, getFromClipboard, sendPages } = useCopyPastePages();
    const { tree } = usePageTreeContext();
    const intl = useIntl();
    const client = useApolloClient();

    const stackApi = React.useContext(StackSwitchApiContext);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDeleteClick = async () => {
        const subTree = subTreeFromNode(props.page, tree);
        const deletedOrderedNodes: GQLPageTreePageFragment[] = [];
        traverse(
            subTree,
            (element) => {
                deletedOrderedNodes.push(element);
            },
            "post-order",
        );
        for (const node of deletedOrderedNodes) {
            await client.mutate<GQLDeletePageTreeNodeMutation, GQLDeletePageTreeNodeMutationVariables>({
                mutation: deletePageMutation,
                variables: { id: node.id },
                refetchQueries: [namedOperations.Query.Pages],
            });
        }
        setDeleteDialogOpen(false);
    };

    return (
        <>
            <IconButton onClick={handleClick} size="large">
                <MoreVertical />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                {props.page.visibility !== "Archived" && [
                    <MenuItem
                        key="editPage"
                        onClick={() => {
                            handleClose();
                            stackApi.activatePage("edit", String(props.page.id));
                        }}
                    >
                        <ListItemIcon>
                            <Edit />
                        </ListItemIcon>
                        <ListItemText primary={<FormattedMessage {...messages.content} />} />
                    </MenuItem>,
                    <MenuItem
                        key="editPageProperties"
                        onClick={() => {
                            handleClose();
                            props.editDialog?.openEditDialog(props.page.id);
                        }}
                    >
                        <ListItemIcon>
                            <Settings />
                        </ListItemIcon>
                        <ListItemText primary={intl.formatMessage({ id: "comet.pages.pages.page.properties", defaultMessage: "Page properties" })} />
                    </MenuItem>,
                    <MenuItem
                        key="copyUrl"
                        onClick={() => {
                            handleClose();
                            writeClipboard(`${props.siteUrl}${props.page.path}`);
                        }}
                    >
                        <ListItemIcon>
                            <Domain />
                        </ListItemIcon>
                        <ListItemText primary={intl.formatMessage({ id: "comet.pages.pages.page.copyUrl", defaultMessage: "Copy URL" })} />
                    </MenuItem>,
                    <MenuItemSeparator key="separator2" />,
                    <MenuItem
                        key="newSubpage"
                        onClick={() => {
                            handleClose();
                            props.editDialog?.openAddDialog(serializeInitialValues({ parent: props.page.id }));
                        }}
                    >
                        <ListItemIcon>
                            <Add />
                        </ListItemIcon>
                        <ListItemText primary={intl.formatMessage({ id: "comet.pages.pages.page.newSubpage", defaultMessage: "New subpage" })} />
                    </MenuItem>,
                    <MovePageMenuItem key="movePage" page={props.page} onClose={handleClose} />,
                    <MenuItemSeparator key="separator3" />,
                    <MenuItem
                        key="copy"
                        onClick={async () => {
                            setCopyLoading(true);
                            const subTree = subTreeFromNode(props.page, tree);
                            const pagesAsArray = treeMapToArray(subTree, "root");
                            const pagesClipboard = await prepareForClipboard(pagesAsArray);
                            await writeToClipboard(pagesClipboard);
                            setCopyLoading(false);
                            handleClose();
                        }}
                    >
                        <ListItemIcon>{!copyLoading ? <Copy /> : <ThreeDotSaving />}</ListItemIcon>
                        <ListItemText primary={intl.formatMessage({ id: "comet.pages.pages.page.copy", defaultMessage: "Copy" })} />
                    </MenuItem>,

                    <MenuItem
                        key="paste"
                        onClick={async () => {
                            setPasting(true);
                            const pages = await getFromClipboard();
                            if (pages.canPaste) {
                                await sendPages(props.page.parentId, pages.content, { targetPos: props.page.pos + 1 });
                            }
                            setPasting(false);
                            handleClose();
                        }}
                    >
                        <ListItemIcon>{!pasting ? <Paste /> : <ThreeDotSaving />}</ListItemIcon>
                        <ListItemText primary={intl.formatMessage({ id: "comet.pages.pages.page.paste", defaultMessage: "Paste" })} />
                    </MenuItem>,
                    <MenuItem
                        onClick={async () => {
                            setDuplicateLoading(true);
                            const subTree = subTreeFromNode(props.page, tree);
                            const pagesAsArray = treeMapToArray(subTree, "root");
                            const pages = await prepareForClipboard(pagesAsArray);
                            await sendPages(props.page.parentId, pages, { targetPos: props.page.pos + 1 });

                            setDuplicateLoading(false);
                            handleClose();
                        }}
                        key="duplicatePage"
                    >
                        <ListItemIcon>{!duplicateLoading ? <Copy /> : <ThreeDotSaving />}</ListItemIcon>
                        <ListItemText primary={<FormattedMessage id="comet.pageTree.duplicate" defaultMessage="Duplicate" />} />
                    </MenuItem>,
                ]}
                <MenuItem
                    onClick={() => {
                        handleClose();
                        setDeleteDialogOpen(true);
                    }}
                    disabled={props.page.slug === "home"}
                >
                    <ListItemIcon>
                        <Delete />
                    </ListItemIcon>
                    <ListItemText primary={intl.formatMessage({ id: "comet.pages.pages.page.delete", defaultMessage: "Delete" })} />
                </MenuItem>
            </Menu>
            <PageDeleteDialog
                dialogOpen={deleteDialogOpen}
                handleCancelClick={() => {
                    setDeleteDialogOpen(false);
                }}
                handleDeleteClick={handleDeleteClick}
                selectedNodes={[props.page]}
            />
        </>
    );
};

export default PageContextMenu;
