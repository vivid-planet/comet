import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { Editor, EditorState } from "draft-js";
import * as React from "react";
import { SuportedThings } from "../Rte";
import { IControlProps } from "../types";
import useBlockTypes from "./useBlockTypes";

export default function BlockTypesControls({
    editorState,
    setEditorState,
    editorRef,
    options: { supports: supportedThings, customBlockMap: customBlockTypeMap },
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
            <Select value={activeDropdownBlockType} displayEmpty onChange={handleBlockTypeChange}>
                <MenuItem value="unstyled">
                    <>Standard</>
                </MenuItem>
                {dropdownFeatures.map(c => (
                    <MenuItem key={c.name} value={c.name}>
                        {c.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
