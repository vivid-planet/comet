# @comet/admin-rte

<<<<<<< HEAD
## 7.0.0-beta.6

### Patch Changes

-   Updated dependencies [119714999]
    -   @comet/admin@7.0.0-beta.6
    -   @comet/admin-icons@7.0.0-beta.6

## 7.0.0-beta.5

### Patch Changes

-   Updated dependencies [569ad0463]
    -   @comet/admin@7.0.0-beta.5
    -   @comet/admin-icons@7.0.0-beta.5

## 7.0.0-beta.4

### Patch Changes

-   Updated dependencies [a0bd09afa]
-   Updated dependencies [170720b0c]
    -   @comet/admin@7.0.0-beta.4
    -   @comet/admin-icons@7.0.0-beta.4

## 7.0.0-beta.3

### Patch Changes

-   Updated dependencies [ce5eaede2]
    -   @comet/admin@7.0.0-beta.3
    -   @comet/admin-icons@7.0.0-beta.3

## 7.0.0-beta.2

### Patch Changes

-   Updated dependencies [2fc764e29]
    -   @comet/admin@7.0.0-beta.2
    -   @comet/admin-icons@7.0.0-beta.2

## 7.0.0-beta.1

### Patch Changes

-   @comet/admin@7.0.0-beta.1
-   @comet/admin-icons@7.0.0-beta.1

## 7.0.0-beta.0

### Major Changes

-   92eae2ba9: Change the method of overriding the styling of Admin components

    -   Remove dependency on the legacy `@mui/styles` package in favor of `@mui/material/styles`.
    -   Add the ability to style components using [MUI's `sx` prop](https://mui.com/system/getting-started/the-sx-prop/).
    -   Add the ability to style individual elements (slots) of a component using the `slotProps` and `sx` props.
    -   The `# @comet/admin-rte syntax in the theme's `styleOverrides` is no longer supported, see: https://mui.com/material-ui/migration/v5-style-changes/#migrate-theme-styleoverrides-to-emotion

    ```diff
     const theme = createCometTheme({
         components: {
             CometAdminMyComponent: {
                 styleOverrides: {
    -                root: {
    -                    "&$hasShadow": {
    -                        boxShadow: "2px 2px 5px 0 rgba(0, 0, 0, 0.25)",
    -                    },
    -                    "& $header": {
    -                        backgroundColor: "lime",
    -                    },
    -                },
    +                hasShadow: {
    +                    boxShadow: "2px 2px 5px 0 rgba(0, 0, 0, 0.25)",
    +                },
    +                header: {
    +                    backgroundColor: "lime",
    +                },
                 },
             },
         },
     });
    ```

    -   Overriding a component's styles using `withStyles` is no longer supported. Use the `sx` and `slotProps` props instead:

    ```diff
    -import { withStyles } from "@mui/styles";
    -
    -const StyledMyComponent = withStyles({
    -    root: {
    -        backgroundColor: "lime",
    -    },
    -    header: {
    -        backgroundColor: "fuchsia",
    -    },
    -})(MyComponent);
    -
    -// ...
    -
    -<StyledMyComponent title="Hello World" />;
    +<MyComponent
    +    title="Hello World"
    +    sx={{
    +        backgroundColor: "lime",
    +    }}
    +    slotProps={{
    +        header: {
    +            sx: {
    +                backgroundColor: "fuchsia",
    +            },
    +        },
    +    }}
    +/>
    ```

    -   The module augmentation for the `DefaultTheme` type from `@mui/styles/defaultTheme` is no longer needed and needs to be removed from the admins theme file, usually located in `admin/src/theme.ts`:

    ```diff
    -declare module "@mui/styles/defaultTheme" {
    -    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    -    export interface DefaultTheme extends Theme {}
    -}
    ```

    -   Class-keys originating from MUI components have been removed from Comet Admin components, causing certain class-names and `styleOverrides` to no longer be applied.
        The components `root` class-key is not affected. Other class-keys will retain the class-names and `styleOverrides` from the underlying MUI component.
        For example, in `ClearInputAdornment` (when used with `position="end"`) the class-name `CometAdminClearInputAdornment-positionEnd` and the `styleOverrides` for `CometAdminClearInputAdornment.positionEnd` will no longer be applied.
        The component will retain the class-names `MuiInputAdornment-positionEnd`, `MuiInputAdornment-root`, and `CometAdminClearInputAdornment-root`.
        Also, the `styleOverrides` for `MuiInputAdornment.positionEnd`, `MuiInputAdornment.root`, and `CometAdminClearInputAdornment.root` will continue to be applied.

        This affects the following components:

        -   `AppHeader`
        -   `AppHeaderMenuButton`
        -   `ClearInputAdornment`
        -   `Tooltip`
        -   `CancelButton`
        -   `DeleteButton`
        -   `OkayButton`
        -   `SaveButton`
        -   `StackBackButton`
        -   `DatePicker`
        -   `DateRangePicker`
        -   `TimePicker`

    -   For more details, see MUI's migration guide: https://mui.com/material-ui/migration/v5-style-changes/#mui-styles

### Patch Changes

-   b5753e612: Allow partial props in the theme's `defaultProps` instead of requiring all props when setting the `defaultProps` of a component
-   Updated dependencies [865f253d8]
-   Updated dependencies [05ce68ec0]
-   Updated dependencies [51a0861d8]
-   Updated dependencies [dc8bb6a99]
-   Updated dependencies [54f775497]
-   Updated dependencies [73140014f]
-   Updated dependencies [9a4530b06]
-   Updated dependencies [dc8bb6a99]
-   Updated dependencies [e3efdfcc3]
-   Updated dependencies [02d33e230]
-   Updated dependencies [6054fdcab]
-   Updated dependencies [d0869ac82]
-   Updated dependencies [9a4530b06]
-   Updated dependencies [47ec528a4]
-   Updated dependencies [956111ab2]
-   Updated dependencies [19eaee4ca]
-   Updated dependencies [758c65656]
-   Updated dependencies [9a4530b06]
-   Updated dependencies [04ed68cc9]
-   Updated dependencies [61b2acfb2]
-   Updated dependencies [0263a45fa]
-   Updated dependencies [4ca4830f3]
-   Updated dependencies [3397ec1b6]
-   Updated dependencies [20b2bafd8]
-   Updated dependencies [51a0861d8]
-   Updated dependencies [9c4b7c974]
-   Updated dependencies [b5753e612]
-   Updated dependencies [2a7bc765c]
-   Updated dependencies [774977311]
-   Updated dependencies [f8114cd39]
-   Updated dependencies [b87c3c292]
-   Updated dependencies [f06f4bea6]
-   Updated dependencies [2a7bc765c]
-   Updated dependencies [d2e64d1ec]
-   Updated dependencies [241249bd4]
-   Updated dependencies [be4e6392d]
-   Updated dependencies [a53545438]
-   Updated dependencies [1a1d83156]
-   Updated dependencies [a2f278bbd]
-   Updated dependencies [66330e4e6]
-   Updated dependencies [b0249e3bc]
-   Updated dependencies [92eae2ba9]
    -   @comet/admin@7.0.0-beta.0
    -   @comet/admin-icons@7.0.0-beta.0
=======
## 6.16.0

### Patch Changes

-   Updated dependencies [fb0fe2539]
-   Updated dependencies [747fe32cc]
    -   @comet/admin@6.16.0
    -   @comet/admin-icons@6.16.0
>>>>>>> main

## 6.15.1

### Patch Changes

-   @comet/admin@6.15.1
-   @comet/admin-icons@6.15.1

## 6.15.0

### Patch Changes

-   Updated dependencies [406027806]
-   Updated dependencies [0654f7bce]
    -   @comet/admin-icons@6.15.0
    -   @comet/admin@6.15.0

## 6.14.1

### Patch Changes

-   @comet/admin@6.14.1
-   @comet/admin-icons@6.14.1

## 6.14.0

### Patch Changes

-   Updated dependencies [2fc764e29]
-   Updated dependencies [efccc42a3]
-   Updated dependencies [012a768ee]
    -   @comet/admin@6.14.0
    -   @comet/admin-icons@6.14.0

## 6.13.0

### Minor Changes

-   5e25348bb: Add a dialog option to the translation feature

    If enabled a dialog will open when pressing the translation button showing the original text and an editable translation

    Control if the dialog should be shown for the current scope via the `showApplyTranslationDialog` prop (default: true)

    ```diff
    <ContentTranslationServiceProvider
        enabled={true}
    +   showApplyTranslationDialog={true}
        translate={...}
    >
    ```

### Patch Changes

-   Updated dependencies [5e25348bb]
-   Updated dependencies [796e83206]
    -   @comet/admin@6.13.0
    -   @comet/admin-icons@6.13.0

## 6.12.0

### Patch Changes

-   dc7eaeccb: Hide translation button for `FinalFormSearchTextField`
-   Updated dependencies [16ffa7be9]
    -   @comet/admin@6.12.0
    -   @comet/admin-icons@6.12.0

## 6.11.0

### Patch Changes

-   Updated dependencies [8e3dec523]
    -   @comet/admin@6.11.0
    -   @comet/admin-icons@6.11.0

## 6.10.0

### Patch Changes

-   Updated dependencies [a8a098a24]
-   Updated dependencies [d4a269e1e]
-   Updated dependencies [52130afba]
-   Updated dependencies [e938254bf]
    -   @comet/admin@6.10.0
    -   @comet/admin-icons@6.10.0

## 6.9.0

### Minor Changes

-   e85837a17: Loosen peer dependency on `react-intl` to allow using v6

### Patch Changes

-   8fb8b209a: Fix losing custom block types when converting between editor state and HTML
-   Updated dependencies [9ff9d66c6]
-   Updated dependencies [e85837a17]
    -   @comet/admin@6.9.0
    -   @comet/admin-icons@6.9.0

## 6.8.0

### Patch Changes

-   @comet/admin@6.8.0
-   @comet/admin-icons@6.8.0

## 6.7.0

### Patch Changes

-   @comet/admin@6.7.0
-   @comet/admin-icons@6.7.0

## 6.6.2

### Patch Changes

-   @comet/admin@6.6.2
-   @comet/admin-icons@6.6.2

## 6.6.1

### Patch Changes

-   @comet/admin@6.6.1
-   @comet/admin-icons@6.6.1

## 6.6.0

### Patch Changes

-   Updated dependencies [95b97d768]
-   Updated dependencies [6b04ac9a4]
    -   @comet/admin@6.6.0
    -   @comet/admin-icons@6.6.0

## 6.5.0

### Patch Changes

-   Updated dependencies [6cb2f9046]
    -   @comet/admin@6.5.0
    -   @comet/admin-icons@6.5.0

## 6.4.0

### Patch Changes

-   Updated dependencies [8ce21f34b]
-   Updated dependencies [811903e60]
    -   @comet/admin@6.4.0
    -   @comet/admin-icons@6.4.0

## 6.3.0

### Patch Changes

-   @comet/admin@6.3.0
-   @comet/admin-icons@6.3.0

## 6.2.1

### Patch Changes

-   @comet/admin@6.2.1
-   @comet/admin-icons@6.2.1

## 6.2.0

### Patch Changes

-   @comet/admin@6.2.0
-   @comet/admin-icons@6.2.0

## 6.1.0

### Minor Changes

-   f1fc9e20: Add support for content translation

### Patch Changes

-   Updated dependencies [dcfa03ca]
-   Updated dependencies [08e0da09]
-   Updated dependencies [b35bb8d1]
-   Updated dependencies [8eb13750]
-   Updated dependencies [a4fac913]
    -   @comet/admin@6.1.0
    -   @comet/admin-icons@6.1.0

## 6.0.0

### Patch Changes

-   803f5045: Retain headings 4 - 6, blockquote and strikethrough formatting when copying from one RTE to another
-   Updated dependencies [76e50aa8]
-   Updated dependencies [a525766c]
    -   @comet/admin-icons@6.0.0

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
