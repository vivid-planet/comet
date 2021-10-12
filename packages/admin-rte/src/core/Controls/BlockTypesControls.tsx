import { FormControl, MenuItem, Select, WithStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { createStyles, withStyles } from "@material-ui/styles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { IControlProps } from "../types";
import getRteTheme from "../utils/getRteTheme";
import useBlockTypes, { BlockTypesApi } from "./useBlockTypes";

interface Props extends IControlProps {
    blockTypes: BlockTypesApi;
}

function BlockTypesControls({
    options: { standardBlockType, blocktypeMap, sortBlockTypes },
    disabled,
    blockTypes,
    classes,
}: Props & WithStyles<typeof styles>) {
    const { dropdownFeatures, activeDropdownBlockType, handleBlockTypeChange } = blockTypes;

    const labelForUnstyled = blocktypeMap?.unstyled?.label || (
        <FormattedMessage id="cometAdmin.rte.controls.blockType.default" defaultMessage="Default" />
    );
    const blockTypesListItems: Array<{ name: string; label: React.ReactNode }> = [
        ...(standardBlockType === "unstyled" ? [{ name: "unstyled", label: labelForUnstyled }] : []),
        ...dropdownFeatures.map((c) => ({ name: c.name, label: c.label })),
    ];

    const sortedBlockTypes = sortBlockTypes ? sortBlockTypes(blockTypesListItems.map((c) => c.name)) : [];
    const sortedBlockTypesListItems = sortedBlockTypes.length
        ? [...blockTypesListItems].sort((a, b) => {
              const indexA = sortedBlockTypes.indexOf(a.name);
              const indexB = sortedBlockTypes.indexOf(b.name);

              // lowest index is first, except -1 (no match) is last
              if (indexA === indexB) {
                  return 0;
              }

              if (indexA === -1) {
                  return 1;
              }

              if (indexB === -1) {
                  return -1;
              }

              return indexA - indexB;
          })
        : blockTypesListItems;

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
                {sortedBlockTypesListItems.map((c) => (
                    <MenuItem key={c.name} value={c.name} dense>
                        {c.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

export type RteBlockTypeControlsClassKey = "root" | "select";

const styles = (theme: Theme) => {
    const rteTheme = getRteTheme(theme.props?.CometAdminRte);

    return createStyles<RteBlockTypeControlsClassKey, Props>({
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
    });
};

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

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminRteBlockTypeControls: RteBlockTypeControlsClassKey;
    }
}
