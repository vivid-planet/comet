import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import FormatListNumberedIcon from "@material-ui/icons/FormatListNumbered";
import { DraftBlockType, Editor, EditorState, RichUtils } from "draft-js";
import * as React from "react";
import { SupportedThings } from "../Rte";
import { ICustomBlockType, ICustomBlockTypeMap, IFeatureConfig } from "../types";
import getCurrentBlock from "../utils/getCurrentBlock";

interface IProps {
    editorState: EditorState;
    setEditorState: (es: EditorState) => void;
    supportedThings: SupportedThings[];
    customBlockTypeMap?: ICustomBlockTypeMap;
    editorRef: React.RefObject<Editor>;
}

const defaultDropdownFeatures: IFeatureConfig[] = [
    {
        name: "header-one",
        label: "Überschrift 1",
    },
    {
        name: "header-two",
        label: "Überschrift 2",
    },
    {
        name: "header-three",
        label: "Überschrift 3",
    },
    {
        name: "header-four",
        label: "Überschrift 4",
    },
    {
        name: "header-five",
        label: "Überschrift 5",
    },
    {
        name: "header-six",
        label: "Überschrift 6",
    },
];

const defaultListsFeatures: IFeatureConfig[] = [
    {
        name: "unordered-list",
        label: "Aufzählungszeichen",
        Icon: FormatListBulletedIcon,
    },
    {
        name: "ordered-list",
        label: "Nummerierte Liste",
        Icon: FormatListNumberedIcon,
    },
];

function getBlockTypeForFeatureName(name: string): DraftBlockType {
    switch (name) {
        case "unordered-list":
            return "unordered-list-item";
        case "ordered-list":
            return "ordered-list-item";
        default:
            return name;
    }
}
export default function useBlockTypes({ editorState, setEditorState, supportedThings, customBlockTypeMap, editorRef }: IProps) {
    // can check if blocktype is supported by the editor
    const supports = React.useCallback(
        (blockType: DraftBlockType) => {
            switch (blockType) {
                case "unordered-list-item":
                    return supportedThings.includes("unordered-list");
                case "ordered-list-item":
                    return supportedThings.includes("ordered-list");
                case "header-one":
                    return supportedThings.includes("header-one");
                case "header-two":
                    return supportedThings.includes("header-two");
                case "header-three":
                    return supportedThings.includes("header-three");
                case "header-four":
                    return supportedThings.includes("header-four");
                case "header-five":
                    return supportedThings.includes("header-five");
                case "header-six":
                    return supportedThings.includes("header-six");
                default:
                    return false;
            }
        },
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

    const customDropdownFeatures = React.useMemo(() => {
        let customDropdownFeaturesInner: IFeatureConfig[] = [];

        if (customBlockTypeMap) {
            customDropdownFeaturesInner = Object.entries<ICustomBlockType>(customBlockTypeMap).reduce<IFeatureConfig[]>((a, [key, config]) => {
                a.push({
                    name: key,
                    label: config.label,
                });
                return a;
            }, []);
        }
        return customDropdownFeaturesInner;
    }, [customBlockTypeMap]);

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
        () =>
            [...defaultDropdownFeatures.filter(c => supports(c.name)), ...customDropdownFeatures].map(c => ({
                ...c,
                selected: blockTypeActive(getBlockTypeForFeatureName(c.name)),
                onButtonClick: handleBlockTypeButtonClick.bind(null, getBlockTypeForFeatureName(c.name)),
            })),
        [supports, blockTypeActive, handleBlockTypeButtonClick, customDropdownFeatures],
    );

    const listsFeatures: IFeatureConfig[] = React.useMemo(
        () =>
            defaultListsFeatures
                .filter(c => supports(getBlockTypeForFeatureName(c.name)))
                .map(c => ({
                    ...c,
                    selected: blockTypeActive(getBlockTypeForFeatureName(c.name)),
                    onButtonClick: handleBlockTypeButtonClick.bind(null, getBlockTypeForFeatureName(c.name)),
                })),
        [supports, blockTypeActive, handleBlockTypeButtonClick],
    );

    const activeDropdownBlockType = React.useMemo(() => {
        const activeFeature = dropdownFeatures.find(c => c.selected);
        return activeFeature ? activeFeature.name : "unstyled";
    }, [dropdownFeatures]);

    return {
        dropdownFeatures,
        activeDropdownBlockType,
        handleBlockTypeChange,
        listsFeatures,
    };
}
