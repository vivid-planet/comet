import { FormControl, makeStyles, MenuItem, Select } from "@material-ui/core";
import { StyledComponentProps, Theme } from "@material-ui/core/styles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { mergeClasses } from "../../mergeClasses"; // TODO: Import form "@comet/admin" after next release
import { IControlProps } from "../types";
import getRteTheme from "../utils/getRteTheme";
import useBlockTypes, { BlockTypesApi } from "./useBlockTypes";

interface Props extends IControlProps {
    blockTypes: BlockTypesApi;
}

function BlockTypesControls({
    options: { standardBlockType },
    disabled,
    blockTypes,
    classes: passedClasses,
}: Props & StyledComponentProps<CometAdminRteBlockTypeControlsClassKeys>) {
    const { dropdownFeatures, activeDropdownBlockType, handleBlockTypeChange } = blockTypes;
    const classes = mergeClasses<CometAdminRteBlockTypeControlsClassKeys>(useStyles(), passedClasses);

    return (
        <FormControl classes={{ root: classes.root }}>
            <Select
                classes={{ root: classes.select }}
                disabled={disabled}
                value={activeDropdownBlockType}
                displayEmpty
                disableUnderline
                onChange={handleBlockTypeChange}
            >
                {standardBlockType === "unstyled" && (
                    <MenuItem value="unstyled" dense>
                        <FormattedMessage id="cometAdmin.rte.controls.blockType.default" defaultMessage="Default" />
                    </MenuItem>
                )}
                {dropdownFeatures.map((c) => (
                    <MenuItem key={c.name} value={c.name} dense>
                        {c.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

export type CometAdminRteBlockTypeControlsClassKeys = "root" | "select";

const useStyles = makeStyles<Theme, {}, CometAdminRteBlockTypeControlsClassKeys>(
    (theme: Theme) => {
        const rteTheme = getRteTheme(theme.props?.CometAdminRte);

        return {
            root: {
                "& [class*='MuiInputBase-root']": {
                    backgroundColor: "transparent",
                    height: "auto",
                    border: "none",
                },
                "& [class*='MuiSelect-icon']": {
                    top: "auto",
                    color: "inherit",
                },
            },
            select: {
                color: rteTheme.colors.buttonIcon,
                minWidth: 180,
                lineHeight: "24px",
                fontSize: 14,
                padding: 0,
            },
        };
    },
    { name: "CometAdminRteBlockTypeControls" },
);

const StyledBlockTypesControls = BlockTypesControls;

// If there are no dropdown-features, this must return null not just an empty component, to prevent an empty item from being rendered in Toolbar
export default (p: IControlProps) => {
    const { editorState, setEditorState, editorRef, options } = p;
    const { supports: supportedThings, blocktypeMap } = options;
    const blockTypes = useBlockTypes({ editorState, setEditorState, supportedThings, blocktypeMap, editorRef });

    if (!blockTypes.dropdownFeatures.length) {
        return null;
    }

    return <StyledBlockTypesControls {...p} blockTypes={blockTypes} />;
};
