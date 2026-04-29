import { useApolloClient } from "@apollo/client";
import { Delete, Drag, MoreVertical, OpenNewTab } from "@comet/admin-icons";
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import { type ComponentProps, isValidElement, type MouseEventHandler, type ReactElement, type ReactNode, useRef, useState } from "react";
import { type DropTargetMonitor, useDrag, useDrop, type XYCoord } from "react-dnd";
import { FormattedMessage, useIntl } from "react-intl";

import { useContentScope } from "../../contentScope/Provider";
import { DamThumbnail } from "../../dam/DataGrid/thumbnail/DamThumbnail";
import { useDependenciesConfig } from "../../dependencies/dependenciesConfig";
import { DamPathLazy } from "./DamPathLazy";
import type { GQLDamMultiFileFieldFileFragment } from "./FileField.gql.generated";

const ITEM_TYPE = "fileFieldFile";

const Row = styled("div", { shouldForwardProp: (prop) => prop !== "isDragging" })<{ isDragging: boolean }>`
    display: flex;
    opacity: ${({ isDragging }) => (isDragging ? 0 : 1)};
    border-bottom: 1px solid ${({ theme }) => theme.palette.divider};

    &:last-of-type {
        border-bottom: none;
    }

    &:hover {
        background-color: ${({ theme }) => theme.palette.grey[50]};
    }
`;

const Grabber = styled("div")`
    position: relative;
    z-index: 11;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    flex-shrink: 0;
    border-right: 1px solid ${({ theme }) => theme.palette.divider};
    cursor: move;
    color: ${({ theme }) => theme.palette.grey[600]};

    &:hover {
        background-color: ${({ theme }) => theme.palette.primary.light};
        color: white;
    }
`;

const Content = styled(Stack)`
    flex-grow: 1;
    min-width: 0;
    padding: ${({ theme }) => theme.spacing(1.5, 2)};
`;

const Preview = styled("div")`
    flex-shrink: 0;
`;

const RowActions = styled(Stack)`
    flex-shrink: 0;
`;

interface ActionItem extends ComponentProps<typeof MenuItem> {
    label: ReactNode;
    icon?: ReactNode;
}

interface DragItem {
    id: string;
    index: number;
}

interface FileFieldRowProps {
    file: GQLDamMultiFileFieldFileFragment;
    index: number;
    onRemove: () => void;
    onMove: (dragIndex: number, hoverIndex: number) => void;
    preview?: (file: GQLDamMultiFileFieldFileFragment) => ReactNode;
    menuActions?: Array<ActionItem | ReactElement | null | undefined>;
}

export const FileFieldRow = ({ file, index, onRemove, onMove, preview, menuActions }: FileFieldRowProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);

    const intl = useIntl();
    const contentScope = useContentScope();
    const apolloClient = useApolloClient();
    const { entityDependencyMap } = useDependenciesConfig();

    const [, drop] = useDrop<DragItem>({
        accept: ITEM_TYPE,
        hover(item, monitor: DropTargetMonitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;
            if (dragIndex === hoverIndex) {
                return;
            }

            const hoverBoundingRect = ref.current.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }

            onMove(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: ITEM_TYPE,
        item: { id: file.id, index },
        collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    });

    drag(drop(ref));

    const handleMoreClick: MouseEventHandler<HTMLElement> = (event) => setMenuAnchorEl(event.currentTarget);
    const handleMenuClose = () => setMenuAnchorEl(null);

    const damDependency = entityDependencyMap["DamFile"];
    const showMoreMenu = Boolean(damDependency) || (menuActions !== undefined && menuActions.length > 0);

    return (
        <Row ref={ref} isDragging={isDragging}>
            <Grabber>
                <Drag color="inherit" />
            </Grabber>
            <Content direction="row" alignItems="center" spacing={2}>
                <Preview>{preview ? preview(file) : <DamThumbnail asset={{ ...file, __typename: "DamFile" }} />}</Preview>
                <ListItemText
                    primary={file.name}
                    secondary={<DamPathLazy fileId={file.id} />}
                    primaryTypographyProps={{ variant: "subtitle1", noWrap: true }}
                    secondaryTypographyProps={{ variant: "body2", color: "textSecondary", noWrap: true, component: "span" }}
                />
                <RowActions direction="row">
                    <IconButton
                        size="small"
                        onClick={onRemove}
                        aria-label={intl.formatMessage({ id: "comet.form.file.removeFile", defaultMessage: "Remove" })}
                    >
                        <Delete color="action" />
                    </IconButton>
                    {showMoreMenu && (
                        <IconButton
                            size="small"
                            onClick={handleMoreClick}
                            aria-label={intl.formatMessage({ id: "comet.form.file.moreActions", defaultMessage: "More actions" })}
                        >
                            <MoreVertical color="action" />
                        </IconButton>
                    )}
                </RowActions>
            </Content>
            {showMoreMenu && (
                <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose}>
                    {damDependency && (
                        <MenuItem
                            onClick={async () => {
                                handleMenuClose();
                                const path = await damDependency.resolvePath({ apolloClient, id: file.id });
                                window.open(contentScope.match.url + path, "_blank");
                            }}
                        >
                            <ListItemIcon>
                                <OpenNewTab />
                            </ListItemIcon>
                            <ListItemText primary={<FormattedMessage id="comet.form.file.openInDam" defaultMessage="Open in DAM" />} />
                        </MenuItem>
                    )}
                    {menuActions?.map((item, itemIndex) => {
                        if (!item) {
                            return null;
                        }
                        if (isValidElement(item)) {
                            return item;
                        }
                        const { label, icon, ...rest } = item as ActionItem;
                        return (
                            <MenuItem key={itemIndex} {...rest}>
                                {!!icon && <ListItemIcon>{icon}</ListItemIcon>}
                                <ListItemText primary={label} />
                            </MenuItem>
                        );
                    })}
                </Menu>
            )}
        </Row>
    );
};
