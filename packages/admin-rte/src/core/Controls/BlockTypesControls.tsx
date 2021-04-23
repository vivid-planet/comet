import { createStyles, FormControl, MenuItem, Select, WithStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/styles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { IControlProps } from "../types";
import useBlockTypes, { BlockTypesApi } from "./useBlockTypes";

interface Props extends IControlProps {
    blockTypes: BlockTypesApi;
}

function BlockTypesControls({ classes, options: { standardBlockType }, disabled, blockTypes }: Props & WithStyles<typeof styles>) {
    const { dropdownFeatures, activeDropdownBlockType, handleBlockTypeChange } = blockTypes;

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

const styles = (theme: Theme) =>
    createStyles<CometAdminRteBlockTypeControlsClassKeys, any>({
        root: {},
        select: {
            color: theme.rte.colors.buttonIcon,
            minWidth: 180,
            lineHeight: "24px",
            fontSize: 14,
            padding: 0,
            "& [class*='MuiSvgIcon-root']": {
                color: "inherit",
            },
        },
    });

const StyledBlockTypesControls = withStyles(styles, { name: "CometAdminRteBlockTypeControls" })(BlockTypesControls);

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
