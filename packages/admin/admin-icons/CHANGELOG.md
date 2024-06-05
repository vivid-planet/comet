# @comet/admin-icons

## 6.11.0

## 6.10.0

## 6.9.0

## 6.8.0

## 6.7.0

## 6.6.2

## 6.6.1

## 6.6.0

## 6.5.0

## 6.4.0

## 6.3.0

## 6.2.1

## 6.2.0

## 6.1.0

### Patch Changes

-   08e0da09: Fix icons inside tooltips by forwarding the ref

## 6.0.0

### Major Changes

-   a525766c: Remove deprecated icons `Betrieb`, `Logische Filter`, `Pool`, `Pool 2`, `State Green`, `State Green Ring`, `State Orange`, `State Orange Ring`, `State Red`, `State Red Ring`, `Vignette 1` and `Vignette 2`.

### Patch Changes

-   76e50aa8: Fix broken `Logout` icon

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
