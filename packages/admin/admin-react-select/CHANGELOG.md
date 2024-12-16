# @comet/admin-react-select

## 7.10.0

### Patch Changes

-   Updated dependencies [8f924d591]
-   Updated dependencies [aa02ca13f]
-   Updated dependencies [6eba5abea]
-   Updated dependencies [6eba5abea]
-   Updated dependencies [bf6b03fe0]
-   Updated dependencies [589b0b9ee]
    -   @comet/admin@7.10.0
    -   @comet/admin-icons@7.10.0

## 7.9.0

### Patch Changes

-   Updated dependencies [6d6131b16]
-   Updated dependencies [7cea765fe]
-   Updated dependencies [48cac4dac]
-   Updated dependencies [0919e3ba6]
-   Updated dependencies [55d40ef08]
    -   @comet/admin@7.9.0
    -   @comet/admin-icons@7.9.0

## 7.8.0

### Patch Changes

-   Updated dependencies [139616be6]
-   Updated dependencies [d8fca0522]
-   Updated dependencies [a168e5514]
-   Updated dependencies [e16ad1a02]
-   Updated dependencies [e78315c9c]
-   Updated dependencies [c6d3ac36b]
-   Updated dependencies [139616be6]
-   Updated dependencies [eefb0546f]
-   Updated dependencies [795ec73d9]
-   Updated dependencies [8617c3bcd]
-   Updated dependencies [d8298d59a]
-   Updated dependencies [daacf1ea6]
-   Updated dependencies [9cc75c141]
    -   @comet/admin@7.8.0
    -   @comet/admin-icons@7.8.0

## 7.7.0

### Patch Changes

-   @comet/admin@7.7.0
-   @comet/admin-icons@7.7.0

## 7.6.0

### Patch Changes

-   Updated dependencies [bc19fb18c]
-   Updated dependencies [37d71a89a]
-   Updated dependencies [cf2ee898f]
-   Updated dependencies [03afcd073]
-   Updated dependencies [00d7ddae1]
-   Updated dependencies [fe8909404]
    -   @comet/admin@7.6.0
    -   @comet/admin-icons@7.6.0

## 7.5.0

### Patch Changes

-   Updated dependencies [bb7c2de72]
-   Updated dependencies [9a6a64ef3]
-   Updated dependencies [c59a60023]
-   Updated dependencies [b5838209b]
-   Updated dependencies [c8f37fbd1]
-   Updated dependencies [4cea3e31b]
-   Updated dependencies [216d93a10]
    -   @comet/admin@7.5.0
    -   @comet/admin-icons@7.5.0

## 7.4.2

### Patch Changes

-   @comet/admin@7.4.2
-   @comet/admin-icons@7.4.2

## 7.4.1

### Patch Changes

-   @comet/admin@7.4.1
-   @comet/admin-icons@7.4.1

## 7.4.0

### Patch Changes

-   Updated dependencies [22863c202]
-   Updated dependencies [cab7c427a]
-   Updated dependencies [48d1403d7]
-   Updated dependencies [1ca46e8da]
-   Updated dependencies [1ca46e8da]
-   Updated dependencies [bef162a60]
-   Updated dependencies [bc1ed880a]
-   Updated dependencies [3e013b05d]
    -   @comet/admin@7.4.0
    -   @comet/admin-icons@7.4.0

## 7.3.2

### Patch Changes

-   Updated dependencies [2286234e5]
    -   @comet/admin@7.3.2
    -   @comet/admin-icons@7.3.2

## 7.3.1

### Patch Changes

-   Updated dependencies [91bfda996]
    -   @comet/admin@7.3.1
    -   @comet/admin-icons@7.3.1

## 7.3.0

### Patch Changes

-   Updated dependencies [6a1310cf6]
-   Updated dependencies [5364ecb37]
-   Updated dependencies [a1f4c0dec]
-   Updated dependencies [2ab7b688e]
    -   @comet/admin@7.3.0
    -   @comet/admin-icons@7.3.0

## 7.2.1

### Patch Changes

-   @comet/admin@7.2.1
-   @comet/admin-icons@7.2.1

## 7.2.0

### Patch Changes

-   Updated dependencies [0fb8d9a26]
-   Updated dependencies [4b267f90d]
    -   @comet/admin@7.2.0
    -   @comet/admin-icons@7.2.0

## 7.1.0

### Patch Changes

-   Updated dependencies [04844d39e]
-   Updated dependencies [dfc4a7fff]
-   Updated dependencies [b1bbd6a0c]
-   Updated dependencies [c0488eb84]
-   Updated dependencies [39ab15616]
-   Updated dependencies [c1ab2b340]
-   Updated dependencies [99a1f0ae6]
-   Updated dependencies [edf14d066]
-   Updated dependencies [2b68513be]
-   Updated dependencies [374f383ba]
-   Updated dependencies [c050f2242]
    -   @comet/admin@7.1.0
    -   @comet/admin-icons@7.1.0

## 7.0.0

### Major Changes

-   e00c8e1fd: Remove `ControlInput` component

    `ControlInput` was never intended to be exported, use MUI's `InputBase` instead.

-   92eae2ba9: Change the method of overriding the styling of Admin components

    -   Remove dependency on the legacy `@mui/styles` package in favor of `@mui/material/styles`.
    -   Add the ability to style components using [MUI's `sx` prop](https://mui.com/system/getting-started/the-sx-prop/).
    -   Add the ability to style individual elements (slots) of a component using the `slotProps` and `sx` props.
    -   The `# @comet/admin-react-select syntax in the theme's `styleOverrides` is no longer supported, see: https://mui.com/material-ui/migration/v5-style-changes/#migrate-theme-styleoverrides-to-emotion

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
-   Updated dependencies [05ce68ec0]
-   Updated dependencies [949356e84]
-   Updated dependencies [51a0861d8]
-   Updated dependencies [dc8bb6a99]
-   Updated dependencies [54f775497]
-   Updated dependencies [73140014f]
-   Updated dependencies [9a4530b06]
-   Updated dependencies [dc8bb6a99]
-   Updated dependencies [e3efdfcc3]
-   Updated dependencies [02d33e230]
-   Updated dependencies [a0bd09afa]
-   Updated dependencies [8cc51b368]
-   Updated dependencies [c46146cb3]
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
-   Updated dependencies [27efe7bd8]
-   Updated dependencies [f8114cd39]
-   Updated dependencies [569ad0463]
-   Updated dependencies [b87c3c292]
-   Updated dependencies [170720b0c]
-   Updated dependencies [f06f4bea6]
-   Updated dependencies [119714999]
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
    -   @comet/admin@7.0.0
    -   @comet/admin-icons@7.0.0

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

## 7.0.0-beta.0

### Major Changes

-   e00c8e1fd: Remove `ControlInput` component

    `ControlInput` was never intended to be exported, use MUI's `InputBase` instead.

-   92eae2ba9: Change the method of overriding the styling of Admin components

    -   Remove dependency on the legacy `@mui/styles` package in favor of `@mui/material/styles`.
    -   Add the ability to style components using [MUI's `sx` prop](https://mui.com/system/getting-started/the-sx-prop/).
    -   Add the ability to style individual elements (slots) of a component using the `slotProps` and `sx` props.
    -   The `# @comet/admin-react-select syntax in the theme's `styleOverrides` is no longer supported, see: https://mui.com/material-ui/migration/v5-style-changes/#migrate-theme-styleoverrides-to-emotion

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

## 6.17.1

### Patch Changes

-   @comet/admin@6.17.1
-   @comet/admin-icons@6.17.1

## 6.17.0

### Patch Changes

-   Updated dependencies [536e95c02]
-   Updated dependencies [7ecc30eba]
-   Updated dependencies [ec4685bf3]
    -   @comet/admin@6.17.0
    -   @comet/admin-icons@6.17.0

## 6.16.0

### Patch Changes

-   Updated dependencies [fb0fe2539]
-   Updated dependencies [747fe32cc]
    -   @comet/admin@6.16.0
    -   @comet/admin-icons@6.16.0

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

### Patch Changes

-   Updated dependencies [5e25348bb]
-   Updated dependencies [796e83206]
    -   @comet/admin@6.13.0
    -   @comet/admin-icons@6.13.0

## 6.12.0

### Patch Changes

-   Updated dependencies [16ffa7be9]
    -   @comet/admin@6.12.0

## 6.11.0

### Patch Changes

-   Updated dependencies [8e3dec523]
    -   @comet/admin@6.11.0

## 6.10.0

### Patch Changes

-   Updated dependencies [a8a098a24]
-   Updated dependencies [d4a269e1e]
-   Updated dependencies [52130afba]
-   Updated dependencies [e938254bf]
    -   @comet/admin@6.10.0

## 6.9.0

### Patch Changes

-   Updated dependencies [9ff9d66c6]
-   Updated dependencies [e85837a17]
    -   @comet/admin@6.9.0

## 6.8.0

### Patch Changes

-   @comet/admin@6.8.0

## 6.7.0

### Patch Changes

-   @comet/admin@6.7.0

## 6.6.2

### Patch Changes

-   @comet/admin@6.6.2

## 6.6.1

### Patch Changes

-   @comet/admin@6.6.1

## 6.6.0

### Patch Changes

-   Updated dependencies [95b97d768]
-   Updated dependencies [6b04ac9a4]
    -   @comet/admin@6.6.0

## 6.5.0

### Patch Changes

-   Updated dependencies [6cb2f9046]
    -   @comet/admin@6.5.0

## 6.4.0

### Patch Changes

-   Updated dependencies [8ce21f34b]
-   Updated dependencies [811903e60]
    -   @comet/admin@6.4.0

## 6.3.0

### Patch Changes

-   @comet/admin@6.3.0

## 6.2.1

### Patch Changes

-   @comet/admin@6.2.1

## 6.2.0

### Patch Changes

-   @comet/admin@6.2.0

## 6.1.0

### Patch Changes

-   Updated dependencies [dcfa03ca]
-   Updated dependencies [b35bb8d1]
-   Updated dependencies [8eb13750]
-   Updated dependencies [a4fac913]
    -   @comet/admin@6.1.0

## 6.0.0

### Patch Changes

-   Updated dependencies [921f6378]
-   Updated dependencies [298b63b7]
-   Updated dependencies [0d768540]
-   Updated dependencies [62779124]
    -   @comet/admin@6.0.0

## 5.6.0

### Patch Changes

-   @comet/admin@5.6.0

## 5.5.0

### Patch Changes

-   @comet/admin@5.5.0

## 5.4.0

### Patch Changes

-   Updated dependencies [ba800163]
-   Updated dependencies [60a18392]
    -   @comet/admin@5.4.0

## 5.3.0

### Patch Changes

-   Updated dependencies [a677a162]
-   Updated dependencies [60cc1b2a]
-   Updated dependencies [5435b278]
    -   @comet/admin@5.3.0

## 5.2.0

### Patch Changes

-   Updated dependencies [25daac07]
-   Updated dependencies [0bed4e7c]
    -   @comet/admin@5.2.0

## 5.1.0

### Patch Changes

-   Updated dependencies [21c30931]
-   Updated dependencies [93b3d971]
-   Updated dependencies [e33cd652]
    -   @comet/admin@5.1.0

## 5.0.0

### Patch Changes

-   Updated dependencies [0453c36a]
-   Updated dependencies [692c8555]
-   Updated dependencies [2559ff74]
-   Updated dependencies [fe5e0735]
-   Updated dependencies [ed692f50]
-   Updated dependencies [987f08b3]
-   Updated dependencies [d0773a1a]
-   Updated dependencies [5f0f8e6e]
-   Updated dependencies [7c6eb68e]
-   Updated dependencies [d4bcab04]
-   Updated dependencies [0f2794e7]
-   Updated dependencies [80b007ae]
-   Updated dependencies [a7116784]
-   Updated dependencies [e57c6c66]
    -   @comet/admin@5.0.0

## 4.7.0

### Patch Changes

-   Updated dependencies [eac9990b]
-   Updated dependencies [fe310df8]
-   Updated dependencies [fde8e42b]
    -   @comet/admin@4.7.0

## 4.6.0

### Patch Changes

-   @comet/admin@4.6.0

## 4.5.0

### Patch Changes

-   Updated dependencies [46cf5a8b]
-   Updated dependencies [8a2c3302]
-   Updated dependencies [6d4ca5bf]
-   Updated dependencies [07d921d2]
    -   @comet/admin@4.5.0

## 4.4.3

### Patch Changes

-   @comet/admin@4.4.3

## 4.4.2

### Patch Changes

-   @comet/admin@4.4.2

## 4.4.1

### Patch Changes

-   Updated dependencies [662abcc9]
    -   @comet/admin@4.4.1

## 4.4.0

### Patch Changes

-   Updated dependencies [e824ffa6]
-   Updated dependencies [3e15b819]
-   Updated dependencies [a77da844]
    -   @comet/admin@4.4.0

## 4.3.0

### Patch Changes

-   @comet/admin@4.3.0

## 4.2.0

### Patch Changes

-   Updated dependencies [67e54a82]
-   Updated dependencies [3567533e]
-   Updated dependencies [7b614c13]
-   Updated dependencies [aaf1586c]
-   Updated dependencies [d25a7cbb]
    -   @comet/admin@4.2.0

## 4.1.0

### Patch Changes

-   Updated dependencies [51466b1a]
-   Updated dependencies [51466b1a]
-   Updated dependencies [51466b1a]
-   Updated dependencies [51466b1a]
-   Updated dependencies [51466b1a]
-   Updated dependencies [c5f2f918]
    -   @comet/admin@4.1.0
