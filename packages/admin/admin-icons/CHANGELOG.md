# @comet/admin-icons

## 4.8.1

## 4.8.0

## 4.7.2

## 4.7.1

## 4.7.0

### Minor Changes

-   dbdc0f55: Add support for non-breaking spaces to RTE

    Add `"non-breaking-space"` to `supports` when creating an RTE:

    ```tsx
    const [useRteApi] = makeRteApi();

    export default function MyRte() {
        const { editorState, setEditorState } = useRteApi();
        return (
            <Rte
                value={editorState}
                onChange={setEditorState}
                options={{
                    supports: [
                        // Non-breaking space
                        "non-breaking-space",
                        // Other options you may wish to support
                        "bold",
                        "italic",
                    ],
                }}
            />
        );
    }
    ```

## 4.6.0

### Minor Changes

-   c3b7f992: Add new icons intended to be used in the RTE
-   c3b7f992: Change how `maxVisible` in `FeaturesButtonGroup` works:

    -   If maxVisible = 4 and there are four features -> all four features (and no dropdown) are shown
    -   If maxVisible = 4 and there are five features -> three features and the dropdown (containing two features) are shown

## 4.5.0

## 4.4.3

## 4.4.2

## 4.4.1

## 4.4.0

## 4.3.0

## 4.2.0

## 4.1.0

### Minor Changes

-   51466b1a: Add `QuestionMark` and `Block` icon
