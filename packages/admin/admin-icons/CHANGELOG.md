# @comet/admin-icons

## 5.8.6

## 5.8.5

## 5.8.4

## 5.8.3

## 5.8.2

## 5.8.1

## 5.8.0

## 5.7.2

## 5.7.1

## 5.7.0

## 5.6.6

## 5.6.5

## 5.6.4

## 5.6.3

## 5.6.2

## 5.6.1

## 5.6.0

## 5.5.0

## 5.4.0

## 5.3.0

### Minor Changes

-   0ff9b9ba: Deprecate icons `StateGreen`, `StateGreenRing`, `StateOrange`, `StateOrangeRing`, `StateRed`, and `StateRedRing`,

### Patch Changes

-   0ff9b9ba: Fix various icons

    Since version 5.2.0 several icons were not displayed correctly. This problem has been fixed.

## 5.2.0

### Minor Changes

-   9fc7d474: Add new icons from the Comet UX library. Replace existing icons with new versions. Mark icons Pool, Pool2, Vignette1, Vignette2, Betrieb, LogischeFilter as deprecated.

## 5.1.0

## 5.0.0

### Minor Changes

-   ed692f50: Add new open and close hamburger icons and use them in the `AppHeaderMenuButton`

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
