import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { TreeView } from "@lexical/react/LexicalTreeView";

export default function DebugTreeViewPlugin(): JSX.Element {
    const [editor] = useLexicalComposerContext();
    return (
        <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "5px", backgroundColor: "#fefefe", color: "#000000" }}>
            <TreeView
                treeTypeButtonClassName="debug-treetype-button"
                timeTravelPanelClassName="debug-timetravel-panel"
                timeTravelButtonClassName="debug-timetravel-button"
                timeTravelPanelSliderClassName="debug-timetravel-panel-slider"
                timeTravelPanelButtonClassName="debug-timetravel-panel-button"
                editor={editor}
            />
        </div>
    );
}
