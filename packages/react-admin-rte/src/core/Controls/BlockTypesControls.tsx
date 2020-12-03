import { MenuItem } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { IControlProps } from "../types";
import * as sc from "./BlockTypesControls.sc";
import useBlockTypes from "./useBlockTypes";

export default function BlockTypesControls({
    editorState,
    setEditorState,
    editorRef,
    options: { supports: supportedThings, customBlockMap: customBlockTypeMap, standardBlockType },
}: IControlProps) {
    const { dropdownFeatures, activeDropdownBlockType, handleBlockTypeChange } = useBlockTypes({
        editorState,
        setEditorState,
        supportedThings,
        customBlockTypeMap,
        editorRef,
    });

    if (!dropdownFeatures.length) {
        return null;
    }

    return (
        <FormControl>
            <sc.Select value={activeDropdownBlockType} displayEmpty disableUnderline onChange={handleBlockTypeChange}>
                {standardBlockType === "unstyled" && (
                    <MenuItem value="unstyled" dense>
                        <FormattedMessage id="reactAdmin.rte.controls.blockType.default" defaultMessage="Default" />
                    </MenuItem>
                )}
                {dropdownFeatures.map((c) => (
                    <MenuItem key={c.name} value={c.name} dense>
                        {c.label}
                    </MenuItem>
                ))}
            </sc.Select>
        </FormControl>
    );
}
