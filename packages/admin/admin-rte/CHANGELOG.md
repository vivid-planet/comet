# @comet/admin-rte

## 5.8.6

### Patch Changes

-   @comet/admin-icons@5.8.6

## 5.8.5

### Patch Changes

-   @comet/admin-icons@5.8.5

## 5.8.4

### Patch Changes

-   @comet/admin-icons@5.8.4

## 5.8.3

### Patch Changes

-   @comet/admin-icons@5.8.3

## 5.8.2

### Patch Changes

-   @comet/admin-icons@5.8.2

## 5.8.1

### Patch Changes

-   @comet/admin-icons@5.8.1

## 5.8.0

### Patch Changes

-   @comet/admin-icons@5.8.0

## 5.7.2

### Patch Changes

-   @comet/admin-icons@5.7.2

## 5.7.1

### Patch Changes

-   @comet/admin-icons@5.7.1

## 5.7.0

### Patch Changes

-   @comet/admin-icons@5.7.0

## 5.6.6

### Patch Changes

-   @comet/admin-icons@5.6.6

## 5.6.5

### Patch Changes

-   @comet/admin-icons@5.6.5

## 5.6.4

### Patch Changes

-   @comet/admin-icons@5.6.4

## 5.6.3

### Patch Changes

-   @comet/admin-icons@5.6.3

## 5.6.2

### Patch Changes

-   @comet/admin-icons@5.6.2

## 5.6.1

### Patch Changes

-   @comet/admin-icons@5.6.1

## 5.6.0

### Patch Changes

-   @comet/admin-icons@5.6.0

## 5.5.0

### Patch Changes

-   @comet/admin-icons@5.5.0

## 5.4.0

### Minor Changes

-   981bf48c: Allow setting a tooltip to the button of custom-inline-styles using the `tooltipText` prop
-   51d6c2b9: Move soft-hyphen functionality to `@comet/admin-rte`

    This allows using the soft-hyphen functionality in plain RTEs, and not only in `RichTextBlock`

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
                        // Soft Hyphen
                        "soft-hyphen",
                        // Other options you may wish to support
                        "bold",
                        "italic",
                    ],
                }}
            />
        );
    }
    ```

### Patch Changes

-   @comet/admin-icons@5.4.0

## 5.3.0

### Patch Changes

-   Updated dependencies [0ff9b9ba]
-   Updated dependencies [0ff9b9ba]
    -   @comet/admin-icons@5.3.0

## 5.2.0

### Patch Changes

-   Updated dependencies [9fc7d474]
    -   @comet/admin-icons@5.2.0

## 5.1.0

### Patch Changes

-   @comet/admin-icons@5.1.0

## 5.0.0

### Patch Changes

-   Updated dependencies [ed692f50]
    -   @comet/admin-icons@5.0.0

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

### Patch Changes

-   Updated dependencies [dbdc0f55]
    -   @comet/admin-icons@4.7.0

## 4.6.0

### Patch Changes

-   c3b7f992: Replace current icons in the RTE toolbar with new icons from `@comet/admin-icons`
-   Updated dependencies [c3b7f992]
-   Updated dependencies [c3b7f992]
    -   @comet/admin-icons@4.6.0

## 4.5.0

## 4.4.3

## 4.4.2

## 4.4.1

## 4.4.0

## 4.3.0

### Minor Changes

-   865cc5cf: Remove the indenting options on an RTE if listLevelMax = 0

### Patch Changes

-   3dc5f55a: Remove unsupported list levels from RTE when using `listLevelMax`

## 4.2.0

## 4.1.0
