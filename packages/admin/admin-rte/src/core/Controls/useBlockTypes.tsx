import { DraftBlockType, Editor, EditorState, RichUtils } from "draft-js";
import * as React from "react";

import { SupportedThings } from "../Rte";
import { IBlocktypeMap, IFeatureConfig } from "../types";
import getCurrentBlock from "../utils/getCurrentBlock";

interface IProps {
    editorState: EditorState;
    setEditorState: (es: EditorState) => void;
    supportedThings: SupportedThings[];
    blocktypeMap: IBlocktypeMap;
    editorRef: React.RefObject<Editor>;
    standardBlockType: DraftBlockType;
}

interface IFeaturesFromBlocktypeMapArg {
    blocktypeMap: IBlocktypeMap;
    supports: (a?: SupportedThings) => boolean;
    blockTypeActive: (a: DraftBlockType) => boolean;
    handleBlockTypeButtonClick: (blockType: DraftBlockType, e: React.MouseEvent) => void;
    standardBlockType: DraftBlockType;
}

const DEFAULT_GROUP = "dropdown";

const createFeaturesFromBlocktypeMap =
    (group: "dropdown" | "button") =>
    ({ blocktypeMap, supports, blockTypeActive, handleBlockTypeButtonClick, standardBlockType }: IFeaturesFromBlocktypeMapArg): IFeatureConfig[] =>
        [
            ...Object.entries(blocktypeMap)
                .filter(
                    ([key, config]) =>
                        ((!config.group && group === DEFAULT_GROUP) || (config.group && config.group === group)) && // empty groups are ok for the default group OR group must match
                        (!config.supportedBy || supports(config.supportedBy)) && // either no supportedBy given or the specific "supportedBy"-value is in the supports array
                        (key !== "unstyled" || standardBlockType === "unstyled"), // unstyled passes only when it is the standardBlock
                )
                .map(([blocktype, config]) => ({
                    name: blocktype,
                    label: config.label ?? blocktype,
                    selected: blockTypeActive(blocktype),
                    onButtonClick: handleBlockTypeButtonClick.bind(null, blocktype),
                    icon: config.icon,
                })),
        ];

export interface BlockTypesApi {
    dropdownFeatures: IFeatureConfig[];
    activeDropdownBlockType: string;
    handleBlockTypeChange: (e: React.ChangeEvent<{ value: DraftBlockType }>) => void;
    listsFeatures: IFeatureConfig[];
}

export default function useBlockTypes({
    editorState,
    setEditorState,
    supportedThings,
    blocktypeMap,
    editorRef,
    standardBlockType,
}: IProps): BlockTypesApi {
    // can check if blocktype is supported by the editor
    const supports = React.useCallback(
        (supportedBy?: SupportedThings) => (supportedBy ? supportedThings.includes(supportedBy) : true),
        [supportedThings],
    );

    const blockTypeActive = React.useCallback(
        (blockType: DraftBlockType) => {
            const currentBlock = getCurrentBlock(editorState);
            if (!currentBlock) {
                return false;
            }
            return currentBlock.getType() === blockType;
        },
        [editorState],
    );

    const handleBlockTypeButtonClick = React.useCallback(
        (blockType: DraftBlockType, e: React.MouseEvent) => {
            e.preventDefault();
            setEditorState(RichUtils.toggleBlockType(editorState, blockType));
        },
        [setEditorState, editorState],
    );

    const handleBlockTypeChange = React.useCallback(
        (e: React.ChangeEvent<{ value: DraftBlockType }>) => {
            e.preventDefault();

            if (!e.target.value) {
                const currentBlock = getCurrentBlock(editorState);
                if (currentBlock) {
                    setEditorState(RichUtils.toggleBlockType(editorState, currentBlock.getType()));
                }
            } else {
                setEditorState(RichUtils.toggleBlockType(editorState, e.target.value));
            }
            // keeps editor focused
            setTimeout(() => {
                if (editorRef.current) {
                    editorRef.current.focus();
                }
            }, 0);
        },
        [setEditorState, editorState, editorRef],
    );

    const dropdownFeatures: IFeatureConfig[] = React.useMemo(
        () => createFeaturesFromBlocktypeMap("dropdown")({ supports, blockTypeActive, handleBlockTypeButtonClick, blocktypeMap, standardBlockType }),
        [supports, blockTypeActive, handleBlockTypeButtonClick, blocktypeMap],
    );

    const listsFeatures: IFeatureConfig[] = React.useMemo(
        () => createFeaturesFromBlocktypeMap("button")({ supports, blockTypeActive, handleBlockTypeButtonClick, blocktypeMap, standardBlockType }),
        [supports, blockTypeActive, handleBlockTypeButtonClick, blocktypeMap],
    );

    const activeDropdownBlockType: string = React.useMemo(() => {
        const activeFeature = dropdownFeatures.find((c) => c.selected);
        return activeFeature ? activeFeature.name : "unstyled";
    }, [dropdownFeatures]);

    return {
        dropdownFeatures,
        activeDropdownBlockType,
        handleBlockTypeChange,
        listsFeatures,
    };
}
