import { Tooltip } from "@comet/admin";
import {
    MoreHorizontal,
    RteBold,
    RteClearLink,
    RteIndentDecrease,
    RteIndentIncrease,
    RteItalic,
    RteLink,
    RteNonBreakingSpace,
    RteOl,
    RteRedo,
    RteSoftHyphen,
    RteStrikethrough,
    RteSub,
    RteSup,
    RteUl,
    RteUndo,
} from "@comet/admin-icons";
import {
    Box,
    FormControl,
    inputBaseClasses,
    ListItemIcon,
    Menu,
    MenuItem,
    Select,
    type SelectChangeEvent,
    selectClasses,
    type SvgIconProps,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { type Editor, useEditorState } from "@tiptap/react";
import { type ForwardRefExoticComponent, type MouseEvent, type ReactNode, type RefAttributes, useState } from "react";
import { FormattedMessage } from "react-intl";

import { type BlockInterface, type LinkBlockInterface } from "../types";
import { type TipTapBlockStyle, type TipTapBlockType, type TipTapSupports } from "./createTipTapRichTextBlock";
import { TipTapLinkDialog } from "./TipTapLinkDialog";

const toolbarButtonSx = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 24,
    width: 24,
    padding: 0,
    backgroundColor: "transparent",
    border: "1px solid transparent",
    boxSizing: "border-box",
    transition: "background-color 200ms, border-color 200ms, color 200ms",
    color: grey[600],
    "&:hover": {
        backgroundColor: grey[200],
        borderColor: grey[400],
    },
    "&:disabled": {
        color: grey[300],
        "&, &:hover": {
            backgroundColor: "transparent",
            borderColor: "transparent",
        },
    },
} as const;

const toolbarButtonSelectedSx = {
    "&:not(:disabled), &:not(:disabled):hover": {
        borderColor: grey[400],
        backgroundColor: "white",
    },
} as const;

const ToolbarButton = ({
    editor,
    icon: Icon,
    tooltip,
    isActive,
    disabled,
    onToggle,
}: {
    editor: Editor;
    icon: ForwardRefExoticComponent<Omit<SvgIconProps, "ref"> & RefAttributes<SVGSVGElement>>;
    tooltip: ReactNode;
    isActive?: string;
    disabled?: boolean;
    onToggle: () => void;
}) => (
    <Tooltip title={tooltip}>
        <Box
            component="button"
            type="button"
            disabled={disabled}
            onMouseDown={(e: MouseEvent) => {
                e.preventDefault();
                onToggle();
            }}
            sx={{
                ...toolbarButtonSx,
                ...(isActive && editor.isActive(isActive) ? toolbarButtonSelectedSx : {}),
            }}
        >
            <Icon sx={{ fontSize: 15 }} color="inherit" />
        </Box>
    </Tooltip>
);

const toolbarSlotSx = {
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
    flexGrow: 0,
    height: 34,
    boxSizing: "border-box",
    py: "5px",
    pr: "6px",
    mr: "5px",
    borderRight: `1px solid ${grey[300]}`,
    "&:last-child": {
        mr: 0,
        pr: 0,
        borderRight: "none",
    },
} as const;

const ToolbarGroup = ({ children }: { children: ReactNode }) => <Box sx={toolbarSlotSx}>{children}</Box>;

const selectFormControlSx = {
    [`& .${inputBaseClasses.root}`]: {
        backgroundColor: "transparent",
        height: "auto",
        border: "none",
        "&, &:hover": { "&:before, &:after": { borderBottomWidth: 0 } },
    },
    [`& .${selectClasses.icon}`]: { top: "auto", color: "inherit" },
} as const;

const selectSx = {
    [`& .${selectClasses.select}.${inputBaseClasses.input}`]: {
        minHeight: 0,
        color: grey[600],
        minWidth: 180,
        lineHeight: "24px",
        fontSize: 14,
        p: 0,
    },
} as const;

export const TipTapToolbar = ({
    editor,
    supports,
    blockStyles,
    linkBlock,
}: {
    editor: Editor;
    supports: TipTapSupports[];
    blockStyles: TipTapBlockStyle[];
    linkBlock?: BlockInterface & LinkBlockInterface;
}) => {
    const [moreAnchorEl, setMoreAnchorEl] = useState<null | HTMLElement>(null);
    const [linkDialogOpen, setLinkDialogOpen] = useState(false);
    const inlineStyles = (["bold", "italic", "strike"] as const).some((s) => supports.includes(s));
    const moreOptions = (["sub", "sup"] as const).some((s) => supports.includes(s));
    const lists = (["ordered-list", "unordered-list"] as const).some((s) => supports.includes(s));
    const specialChars = (["non-breaking-space", "soft-hyphen"] as const).some((s) => supports.includes(s));
    const hasLink = supports.includes("link") && !!linkBlock;

    const editorState = useEditorState({
        editor,
        selector: ({ editor: e }: { editor: Editor }) => {
            const activeBlockType = (() => {
                for (let level = 1; level <= 6; level++) {
                    if (e.isActive("heading", { level })) return String(level);
                }
                return "paragraph";
            })();
            const activeTipTapBlockType: TipTapBlockType = (() => {
                for (let level = 1; level <= 6; level++) {
                    if (e.isActive("heading", { level })) return `heading-${level}` as TipTapBlockType;
                }
                return "paragraph";
            })();
            const attrs = e.isActive("heading") ? e.getAttributes("heading") : e.getAttributes("paragraph");
            return {
                activeBlockType,
                activeTipTapBlockType,
                activeBlockStyle: (attrs.blockStyle as string) ?? "",
                canUndo: e.can().undo(),
                canRedo: e.can().redo(),
                canIndent: e.can().sinkListItem("listItem"),
                canDedent: e.can().liftListItem("listItem"),
                isBoldActive: e.isActive("bold"),
                isItalicActive: e.isActive("italic"),
                isStrikeActive: e.isActive("strike"),
                isSuperscriptActive: e.isActive("superscript"),
                isSubscriptActive: e.isActive("subscript"),
                isOrderedListActive: e.isActive("orderedList"),
                isBulletListActive: e.isActive("bulletList"),
                isLinkActive: e.isActive("link"),
                selectionEmpty: e.state.selection.empty,
            };
        },
    });

    const handleMoreClose = () => {
        setMoreAnchorEl(null);
        setTimeout(() => editor.commands.focus(), 0);
    };

    const applicableBlockStyles = blockStyles.filter((style) => !style.appliesTo || style.appliesTo.includes(editorState.activeTipTapBlockType));

    const handleBlockTypeChange = (e: SelectChangeEvent) => {
        const value = e.target.value;
        if (value === "paragraph") {
            editor.chain().focus().setParagraph().run();
        } else {
            editor
                .chain()
                .focus()
                .setHeading({ level: Number(value) as 1 | 2 | 3 | 4 | 5 | 6 })
                .run();
        }

        // Clear blockStyle if it's not applicable to the new block type
        if (blockStyles.length > 0) {
            const { activeBlockStyle } = editorState;
            if (activeBlockStyle) {
                const newType: TipTapBlockType = value === "paragraph" ? "paragraph" : (`heading-${value}` as TipTapBlockType);
                const styleConfig = blockStyles.find((s) => s.name === activeBlockStyle);
                if (styleConfig?.appliesTo && !styleConfig.appliesTo.includes(newType)) {
                    const nodeType = value === "paragraph" ? "paragraph" : "heading";
                    editor.chain().updateAttributes(nodeType, { blockStyle: null }).run();
                }
            }
        }
    };

    const handleBlockStyleChange = (e: SelectChangeEvent) => {
        const value = e.target.value || null;
        const nodeType = editor.isActive("heading") ? "heading" : "paragraph";
        editor.chain().focus().updateAttributes(nodeType, { blockStyle: value }).run();
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexWrap: "wrap",
                borderTop: `1px solid ${grey[100]}`,
                backgroundColor: grey[100],
                px: "6px",
            }}
        >
            {supports.includes("history") && (
                <ToolbarGroup>
                    <ToolbarButton
                        editor={editor}
                        icon={RteUndo}
                        tooltip={<FormattedMessage id="comet.blocks.tipTapRichText.undo.tooltip" defaultMessage="Undo" />}
                        disabled={!editorState.canUndo}
                        onToggle={() => editor.chain().focus().undo().run()}
                    />
                    <ToolbarButton
                        editor={editor}
                        icon={RteRedo}
                        tooltip={<FormattedMessage id="comet.blocks.tipTapRichText.redo.tooltip" defaultMessage="Redo" />}
                        disabled={!editorState.canRedo}
                        onToggle={() => editor.chain().focus().redo().run()}
                    />
                </ToolbarGroup>
            )}
            {supports.includes("heading") && (
                <ToolbarGroup>
                    <FormControl sx={selectFormControlSx}>
                        <Select
                            value={editorState.activeBlockType}
                            onChange={handleBlockTypeChange}
                            displayEmpty
                            variant="filled"
                            MenuProps={{ elevation: 1 }}
                            sx={selectSx}
                        >
                            <MenuItem value="paragraph" dense>
                                <FormattedMessage id="comet.blocks.tipTapRichText.blockType.default" defaultMessage="Default" />
                            </MenuItem>
                            {([1, 2, 3, 4, 5, 6] as const).map((level) => (
                                <MenuItem key={level} value={String(level)} dense>
                                    <FormattedMessage
                                        id="comet.blocks.tipTapRichText.blockType.heading"
                                        defaultMessage="Heading {level}"
                                        values={{ level }}
                                    />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </ToolbarGroup>
            )}
            {applicableBlockStyles.length > 0 && (
                <ToolbarGroup>
                    <FormControl sx={selectFormControlSx}>
                        <Select
                            value={editorState.activeBlockStyle}
                            onChange={handleBlockStyleChange}
                            displayEmpty
                            variant="filled"
                            MenuProps={{ elevation: 1 }}
                            sx={selectSx}
                        >
                            <MenuItem value="" dense>
                                <FormattedMessage id="comet.blocks.tipTapRichText.blockStyle.default" defaultMessage="Default" />
                            </MenuItem>
                            {applicableBlockStyles.map((style) => (
                                <MenuItem key={style.name} value={style.name} dense>
                                    {style.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </ToolbarGroup>
            )}
            {(inlineStyles || moreOptions) && (
                <ToolbarGroup>
                    {supports.includes("bold") && (
                        <ToolbarButton
                            editor={editor}
                            icon={RteBold}
                            tooltip={<FormattedMessage id="comet.blocks.tipTapRichText.bold.tooltip" defaultMessage="Bold" />}
                            isActive="bold"
                            onToggle={() => editor.chain().focus().toggleBold().run()}
                        />
                    )}
                    {supports.includes("italic") && (
                        <ToolbarButton
                            editor={editor}
                            icon={RteItalic}
                            tooltip={<FormattedMessage id="comet.blocks.tipTapRichText.italic.tooltip" defaultMessage="Italic" />}
                            isActive="italic"
                            onToggle={() => editor.chain().focus().toggleItalic().run()}
                        />
                    )}
                    {supports.includes("strike") && (
                        <ToolbarButton
                            editor={editor}
                            icon={RteStrikethrough}
                            tooltip={<FormattedMessage id="comet.blocks.tipTapRichText.strike.tooltip" defaultMessage="Strikethrough" />}
                            isActive="strike"
                            onToggle={() => editor.chain().focus().toggleStrike().run()}
                        />
                    )}
                    {moreOptions && (
                        <>
                            <Tooltip title={<FormattedMessage id="comet.blocks.tipTapRichText.moreOptions.tooltip" defaultMessage="More options" />}>
                                <Box
                                    component="button"
                                    type="button"
                                    onMouseDown={(e: MouseEvent) => {
                                        e.preventDefault();
                                        setMoreAnchorEl(e.currentTarget as HTMLElement);
                                    }}
                                    sx={toolbarButtonSx}
                                >
                                    <MoreHorizontal sx={{ fontSize: 15 }} color="inherit" />
                                </Box>
                            </Tooltip>
                            <Menu open={Boolean(moreAnchorEl)} anchorEl={moreAnchorEl} onClose={handleMoreClose}>
                                {supports.includes("sup") && (
                                    <MenuItem
                                        selected={editor.isActive("superscript")}
                                        onMouseDown={(e) => {
                                            handleMoreClose();
                                            e.persist();
                                            setTimeout(() => editor.chain().focus().toggleSuperscript().run(), 0);
                                        }}
                                    >
                                        <FormattedMessage id="comet.blocks.tipTapRichText.superscript.label" defaultMessage="Superscript" />
                                        <ListItemIcon sx={{ justifyContent: "flex-end" }}>
                                            <RteSup />
                                        </ListItemIcon>
                                    </MenuItem>
                                )}
                                {supports.includes("sub") && (
                                    <MenuItem
                                        selected={editor.isActive("subscript")}
                                        onMouseDown={(e) => {
                                            handleMoreClose();
                                            e.persist();
                                            setTimeout(() => editor.chain().focus().toggleSubscript().run(), 0);
                                        }}
                                    >
                                        <FormattedMessage id="comet.blocks.tipTapRichText.subscript.label" defaultMessage="Subscript" />
                                        <ListItemIcon sx={{ justifyContent: "flex-end" }}>
                                            <RteSub />
                                        </ListItemIcon>
                                    </MenuItem>
                                )}
                            </Menu>
                        </>
                    )}
                </ToolbarGroup>
            )}
            {lists && (
                <ToolbarGroup>
                    {supports.includes("ordered-list") && (
                        <ToolbarButton
                            editor={editor}
                            icon={RteOl}
                            tooltip={<FormattedMessage id="comet.blocks.tipTapRichText.orderedList.tooltip" defaultMessage="Ordered list" />}
                            isActive="orderedList"
                            onToggle={() => editor.chain().focus().toggleOrderedList().run()}
                        />
                    )}
                    {supports.includes("unordered-list") && (
                        <ToolbarButton
                            editor={editor}
                            icon={RteUl}
                            tooltip={<FormattedMessage id="comet.blocks.tipTapRichText.bulletList.tooltip" defaultMessage="Bullet list" />}
                            isActive="bulletList"
                            onToggle={() => editor.chain().focus().toggleBulletList().run()}
                        />
                    )}
                    <ToolbarButton
                        editor={editor}
                        icon={RteIndentIncrease}
                        tooltip={<FormattedMessage id="comet.blocks.tipTapRichText.indent.tooltip" defaultMessage="Increase indent" />}
                        disabled={!editorState.canIndent}
                        onToggle={() => editor.chain().focus().sinkListItem("listItem").run()}
                    />
                    <ToolbarButton
                        editor={editor}
                        icon={RteIndentDecrease}
                        tooltip={<FormattedMessage id="comet.blocks.tipTapRichText.dedent.tooltip" defaultMessage="Decrease indent" />}
                        disabled={!editorState.canDedent}
                        onToggle={() => editor.chain().focus().liftListItem("listItem").run()}
                    />
                </ToolbarGroup>
            )}
            {specialChars && (
                <ToolbarGroup>
                    {supports.includes("non-breaking-space") && (
                        <ToolbarButton
                            editor={editor}
                            icon={RteNonBreakingSpace}
                            tooltip={
                                <FormattedMessage
                                    id="comet.blocks.tipTapRichText.nonBreakingSpace.tooltip"
                                    defaultMessage="Insert a non-breaking space"
                                />
                            }
                            onToggle={() => editor.chain().focus().insertContent({ type: "nonBreakingSpace" }).run()}
                        />
                    )}
                    {supports.includes("soft-hyphen") && (
                        <ToolbarButton
                            editor={editor}
                            icon={RteSoftHyphen}
                            tooltip={<FormattedMessage id="comet.blocks.tipTapRichText.softHyphen.tooltip" defaultMessage="Insert a soft hyphen" />}
                            onToggle={() => editor.chain().focus().insertContent({ type: "softHyphen" }).run()}
                        />
                    )}
                </ToolbarGroup>
            )}
            {hasLink && linkBlock && (
                <ToolbarGroup>
                    <ToolbarButton
                        editor={editor}
                        icon={RteLink}
                        tooltip={<FormattedMessage id="comet.blocks.tipTapRichText.link.tooltip" defaultMessage="Link" />}
                        isActive="link"
                        disabled={editorState.selectionEmpty && !editorState.isLinkActive}
                        onToggle={() => setLinkDialogOpen(true)}
                    />
                    <ToolbarButton
                        editor={editor}
                        icon={RteClearLink}
                        tooltip={<FormattedMessage id="comet.blocks.tipTapRichText.removeLink.tooltip" defaultMessage="Remove link" />}
                        disabled={!editorState.isLinkActive}
                        onToggle={() => editor.chain().focus().extendMarkRange("link").unsetCmsLink().run()}
                    />
                </ToolbarGroup>
            )}
            {linkDialogOpen && linkBlock && <TipTapLinkDialog editor={editor} linkBlock={linkBlock} onClose={() => setLinkDialogOpen(false)} />}
        </Box>
    );
};
