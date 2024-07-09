# @comet/admin

## 6.15.1

### Patch Changes

-   @comet/admin-icons@6.15.1

## 6.15.0

### Patch Changes

-   0654f7bce: Handle unauthorized and unauthenticated correctly in error dialog

    The error dialog now presents screens according to the current state. Required to work in all conditions:

    -   `CurrentUserProvider` must be beneath `MuiThemeProvider` and `IntlProvider` and above `RouterBrowserRouter`
    -   `ErrorDialogHandler` must be parallel to `CurrentUserProvider`

-   Updated dependencies [406027806]
    -   @comet/admin-icons@6.15.0

## 6.14.1

### Patch Changes

-   @comet/admin-icons@6.14.1

## 6.14.0

### Minor Changes

-   2fc764e29: Add `OnChangeField` helper to listen to field changes

    **Example**

    ```tsx
    <OnChangeField name="product">
        {(value, previousValue) => {
            // Will be called when field 'product' changes
        }}
    </OnChangeField>
    ```

### Patch Changes

-   012a768ee: Fix infinite update loop in `useAsyncOptionsProps`
-   Updated dependencies [efccc42a3]
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

-   796e83206: Add `AutocompleteField` and `AsyncAutocompleteField` components

    **Examples**

    ```tsx
    <AutocompleteField
        name="autocomplete"
        label="Autocomplete"
        options={[
            { value: "chocolate", label: "Chocolate" },
            { value: "strawberry", label: "Strawberry" },
            { value: "vanilla", label: "Vanilla" },
        ]}
        getOptionLabel={(option: Option) => option.label}
        isOptionEqualToValue={(option: Option, value: Option) => option.value === value.value}
        fullWidth
    />
    ```

    ```tsx
    <AsyncAutocompleteField
        name="asyncAutocomplete"
        label="Async Autocomplete"
        loadOptions={async () => {
            // Load options here
        }}
        getOptionLabel={(option: Option) => option.label}
        isOptionEqualToValue={(option: Option, value: Option) => option.value === value.value}
        fullWidth
    />
    ```

### Patch Changes

-   @comet/admin-icons@6.13.0

## 6.12.0

### Minor Changes

-   16ffa7be9: Add `FinalFormAsyncSelect`, `AsyncSelectField`, and `FinalFormAsyncAutocomplete` components

    Thin wrappers to ease using `useAsyncOptionsProps()` with `FinalFormSelect` and `FinalFormAutocomplete`.

    **Example**

    Previously:

    ```tsx
    const asyncOptionsProps = useAsyncOptionsProps(async () => {
        // Load options here
    });

    // ...

    <Field component={FinalFormAsyncAutocomplete} {...asyncOptionsProps} />;
    ```

    Now:

    ```tsx
    <Field
        component={FinalFormAsyncAutocomplete}
        loadOptions={async () => {
            // Load options here
        }}
    />
    ```

### Patch Changes

-   @comet/admin-icons@6.12.0

## 6.11.0

### Minor Changes

-   8e3dec523: Change `writeClipboardText`/`readClipboardText` clipboard fallback to in-memory

    Using the local storage as a fallback caused issues when writing clipboard contents larger than 5MB.
    Changing the fallback to in-memory resolves the issue.

### Patch Changes

-   @comet/admin-icons@6.11.0

## 6.10.0

### Minor Changes

-   d4a269e1e: Add `filterByFragment` to replace graphql-anywhere's `filter`

    [graphql-anywhere](https://www.npmjs.com/package/graphql-anywhere) is no longer maintained.
    However, its `filter` utility is useful for filtering data by a GraphQL document, e.g., a fragment.
    Therefore, the function was copied to `@comet/admin`.
    To migrate, replace all `filter` calls with `filterByFragment`:

    ```diff
    - import { filter } from "graphql-anywhere";
    + import { filterByFragment } from "@comet/admin";

    const initialValues: Partial<FormValues> = data?.product
        ? {
    -       ...filter<GQLProductPriceFormFragment>(productPriceFormFragment, data.product),
    +       ...filterByFragment<GQLProductPriceFormFragment>(productPriceFormFragment, data.product),
            price: String(data.product.price),
        }
        : {};
    ```

    You can then uninstall the `graphql-anywhere` package:

    ```bash
    # In admin/
    npm uninstall graphql-anywhere
    ```

-   52130afba: Add `FinalFormFileSelect` component

    Allows selecting files via the file dialog or using drag-and-drop.

-   e938254bf: Add the `useDataGridExcelExport` hook for exporting data from a `DataGrid` to an excel file

    The hook returns an `exportApi` encompassing:

    -   `exportGrid`: a function to generate and export the excel file
    -   `loading`: a boolean indicating if the export is in progress
    -   `error`: an error when the export has failed

### Patch Changes

-   a8a098a24: muiGridFilterToGql: change fallback operator to 'and' to match MUI default
    -   @comet/admin-icons@6.10.0

## 6.9.0

### Minor Changes

-   e85837a17: Loosen peer dependency on `react-intl` to allow using v6

### Patch Changes

-   9ff9d66c6: Ignore local storage quota exceeded error in `writeClipboardText`
    -   @comet/admin-icons@6.9.0

## 6.8.0

### Patch Changes

-   @comet/admin-icons@6.8.0

## 6.7.0

### Patch Changes

-   @comet/admin-icons@6.7.0

## 6.6.2

### Patch Changes

-   @comet/admin-icons@6.6.2

## 6.6.1

### Patch Changes

-   @comet/admin-icons@6.6.1

## 6.6.0

### Minor Changes

-   95b97d768: useDataGridRemote: Add `initialFilter` option

    **Example usage:**

    ```tsx
    const dataGridProps = useDataGridRemote({
        initialFilter: { items: [{ columnField: "description", operatorValue: "contains", value: "text" }] },
    });
    ```

### Patch Changes

-   6b04ac9a4: Fix the key for accessing the themes `styleOverrides` and `defaultProps` of `CometAdminMenu`
    -   @comet/admin-icons@6.6.0

## 6.5.0

### Minor Changes

-   6cb2f9046: Add `ContentOverflow` component

    Used to wrap content that may be too large to fit its container.
    If the content is too large, it will be truncated. When clicked, the entire content will be displayed in a dialog.

    ```tsx
    <ContentOverflow>{/* Lots of content ... */}</ContentOverflow>
    ```

### Patch Changes

-   @comet/admin-icons@6.5.0

## 6.4.0

### Minor Changes

-   8ce21f34b: SaveBoundary: Submit multiple Savables sequentially instead of parallel
-   811903e60: Disable the content translation feature for disabled input fields and non-text inputs

### Patch Changes

-   @comet/admin-icons@6.4.0

## 6.3.0

### Patch Changes

-   @comet/admin-icons@6.3.0

## 6.2.1

### Patch Changes

-   @comet/admin-icons@6.2.1

## 6.2.0

### Patch Changes

-   @comet/admin-icons@6.2.0

## 6.1.0

### Minor Changes

-   b35bb8d1: Add basis for content translation

    Wrap a component with a `ContentTranslationServiceProvider` to add support for content translation to all underlying `FinalFormInput` inputs.

    ```tsx
    <ContentTranslationServiceProvider
        enabled={true}
        translate={async function (text: string): Promise<string> {
            return yourTranslationFnc(text);
        }}
    >
        ...
    </ContentTranslationServiceProvider>
    ```

    You can disable translation for a specific `FinalFormInput` by using the `disableContentTranslation` prop.

    ```diff
    <Field
        required
        fullWidth
        name="myField"
        component={FinalFormInput}
        label={<FormattedMessage id="myField" defaultMessage="My Field" />}
    +   disableContentTranslation
    />
    ```

-   8eb13750: Add `SaveBoundary` and `SaveBoundarySaveButton` that helps implementing multiple forms with a centralized save button

    Render a `Savable` Component anywhere below a `SaveBoundary`. For `FinalForm` this hasn't to be done manually.

-   a4fac913: Rework `Alert` component

    -   Use theme wherever possible
    -   Move styles where they're more fitting
    -   Fix some paddings

### Patch Changes

-   dcfa03ca: Fix a crash when using the `Alert` component inside a MUI `Snackbar`
-   Updated dependencies [08e0da09]
    -   @comet/admin-icons@6.1.0

## 6.0.0

### Major Changes

-   298b63b7: FinalForm: remove default `onAfterSubmit` implementation

    In most cases the default implementation is not needed anymore. When upgrading, an empty
    function override of `onAfterSubmit` can be removed as it is not necessary any longer.

    To get back the old behavior use the following in application code:

    ```
    const stackApi = React.useContext(StackApiContext);
    const editDialog = React.useContext(EditDialogApiContext);
    ....
        <FinalForm
            onAfterSubmit={() => {
                stackApi?.goBack();
                editDialog?.closeDialog({ delay: true });
            }}
        >
    ```

-   0d768540: FinalForm: Don't handle sync submit differently than async submit
-   62779124: Change the signatures of `shouldScrollToField`, `shouldShowFieldError` and `shouldShowFieldWarning` in `FinalFormContext` to match the corresponding methods in `Field`

    The API in `FinalFormContext` was changed from

    ```tsx
    // ❌
    export interface FinalFormContext {
        shouldScrollToField: ({ fieldMeta }: { fieldMeta: FieldMetaState<any> }) => boolean;
        shouldShowFieldError: ({ fieldMeta }: { fieldMeta: FieldMetaState<any> }) => boolean;
        shouldShowFieldWarning: ({ fieldMeta }: { fieldMeta: FieldMetaState<any> }) => boolean;
    }
    ```

    to

    ```tsx
    // ✅
    export interface FinalFormContext {
        shouldScrollToField: (fieldMeta: FieldMetaState<any>) => boolean;
        shouldShowFieldError: (fieldMeta: FieldMetaState<any>) => boolean;
        shouldShowFieldWarning: (fieldMeta: FieldMetaState<any>) => boolean;
    }
    ```

    Now the corresponding methods in `Field` and `FinalFormContext` have the same signature.

### Minor Changes

-   921f6378: Add `helperText` prop to `Field` and `FieldContainer` to provide additional information

### Patch Changes

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

-   60a18392: Add `Alert` component

    **Example:**

    ```tsx
    import { Alert, OkayButton, SaveButton } from "@comet/admin";

    <Alert
        severity="warning"
        title="Title"
        action={
            <Button variant="text" startIcon={<ArrowRight />}>
                Action Text
            </Button>
        }
    >
        Notification Text
    </Alert>;
    ```

### Patch Changes

-   ba800163: Allow passing a mix of elements and arrays to `Tabs` and `RouterTabs` as children

    For example:

    ```tsx
    <RouterTabs>
        <RouterTab label="One" path="">
            One
        </RouterTab>
        {content.map((value) => (
            <RouterTab key={value} label={value} path={`/${value}`}>
                {value}
            </RouterTab>
        ))}
        {showFourthTab && (
            <RouterTab label="Four" path="/four">
                Four
            </RouterTab>
        )}
    </RouterTabs>
    ```

    -   @comet/admin-icons@5.4.0

## 5.3.0

### Minor Changes

-   60cc1b2a: Add `FieldSet` component with accordion behavior for better structuring of big forms.

### Patch Changes

-   a677a162: Fix `RouterPromptHandler` to not show a prompt when navigating to a path with params that is not a sub route
-   5435b278: Fix `shouldScrollTo()`, `shouldShowError()` and `shouldShowWarning()` in `Field`

    Previously, the `meta` argument was passed to these methods incorrectly. Now, the argument is passed as defined by the typing.

-   Updated dependencies [0ff9b9ba]
-   Updated dependencies [0ff9b9ba]
    -   @comet/admin-icons@5.3.0

## 5.2.0

### Minor Changes

-   0bed4e7c: Add optional `hasConflict` prop to `SaveButton`, `FinalFormSaveButton` and `FinalFormSaveSplitButton`

    If set to `true`, a new "conflict" display state is triggered.
    You should pass the `hasConflict` prop returned by `useSaveConflict()`, `useSaveConflictQuery()` and `useFormSaveConflict()`.

### Patch Changes

-   25daac07: Avoid remount of `RouterTab` with `forceRender={true}` when `RouterTabs` are used inside a `Stack`
-   Updated dependencies [9fc7d474]
    -   @comet/admin-icons@5.2.0

## 5.1.0

### Minor Changes

-   93b3d971: Extend error details in `ErrorDialog`

    Previously, uncaught errors in production environments would result in an "An error occurred" `ErrorDialog`, making the error difficult to debug.
    To improve the reproducibility of an error, we enrich the `ErrorDialog` with the following `additionalInformation`:

    -   `errorType`: The type of the error, network or server error
    -   `httpStatus`: The HTTP status of the request that failed
    -   `url`: The URL where the error occurred
    -   `timestamp`: The timestamp when the error occurred

    This information will be displayed in the `ErrorDialog` if no custom `userMessage` has been provided.
    In addition, a button has been added to allow this information to be copied to the clipboard.

### Patch Changes

-   21c30931: Fix `saveAction` in `RouterPrompt` of `FinalForm`

    The submit mutation wasn't correctly awaited if a `FinalForm` using an asynchronous validation was saved via the `saveAction` provided in the `RouterPrompt`.

    In practice, this affected `FinalForm`s within an `EditDialog`. The `EditDialog` closed before the submission was completed. All changes were omitted. The result of the submission (fail or success) was never shown.

-   e33cd652: Fix `EditDialog#onAfterSave` not called on form submission

    The `onAfterSave` callback was only called when submitting a form inside an `EditDialog` by clicking the save button, but not when submitting the form by hitting the enter key.
    We fix this by adding the callback to the `EditDialogFormApi` and calling it after the form has been successfully submitted.

    -   @comet/admin-icons@5.1.0

## 5.0.0

### Major Changes

-   692c8555: Replaced the `DirtyHandler` with `Prompt` (no change needed if `DirtyHandler` was only used indirectly, e.g. in Form)

    Using routes (e.g. `Tabs`) in a component with dirty handling (e.g. a `FinalForm`) is now supported

-   0f2794e7: Change the icon used in the `Loading` component from MUI's `CircularProgress` to our `BallTriangle`
-   fe5e0735: Add support for multi-select to `FinalFormSelect` (via the `multiple` prop)

    Add a new `getOptionValue()` prop that can be used to extract a unique string representation for a given option. The default implementation should work in most cases.
    Remove the `getOptionSelected()` prop that is not needed anymore.

    You can find an example in [our storybook](https://storybook.comet-dxp.com/?path=/story/stories-form-finalform-fields--finalformselect)

-   d0773a1a: Change styling of `FilterBar` components to be more consistent with other form components. The classes of `FilterBarMoreFilters` have changed, which may cause custom styling of this component to break.

### Minor Changes

-   2559ff74: Add CrudVisibility component for implementing visibility column in a Crud Grid
-   ed692f50: Add new open and close hamburger icons and use them in the `AppHeaderMenuButton`
-   7c6eb68e: Add new `event` parameter to `FinalForm`'s `onSubmit()` method. The `navigatingBack` field of `event` simplifies implementing different navigation patterns after saving
-   4cd35441: Add a `FinalFormSaveButton` component
-   a7116784: Add support for multiple `StackSwitch` on one `StackPage`

    Add a `SubRoute` wrapper for this case that needs to be added in front of the tested `StackSwitch` and do that for all composite blocks

    You can find an example in [our storybook](https://storybook.comet-dxp.com/?path=/story/comet-admin-stack--stack-nested-one-stack)

-   e57c6c66: Move dashboard components from the COMET Starter to the library (`DashboardHeader`, `LatestBuildsDashboardWidget`, `LatestContentUpdatesDashboardWidget`)

### Patch Changes

-   0453c36a: Router: Fix `Switch` inside a `SubRouteIndexRoute` to allow a `Stack` inside a `Stack`'s initial page
-   987f08b3: Select: Fix default `getOptionValue()` implementation for values not being an object
-   5f0f8e6e: Correctly support `RouterTabs` in `SubRoute` by including the `subRoutePrefix` in tab paths
-   d4bcab04: Fix `useSubRoutePrefix()` if used inside a `Route`
-   Updated dependencies [ed692f50]
    -   @comet/admin-icons@5.0.0

## 4.7.0

### Minor Changes

-   fde8e42b: Add tab scrolling to make tabs responsive

### Patch Changes

-   eac9990b: Fix the clear-button in `FinalFormSelect` when using it with the `multiple` prop.

    -   The clear button is now only shown when at least one value is selected.
    -   Clearing the value now sets it to an empty array instead of `undefined`, which would cause an error when trying to render the select.

-   fe310df8: Prevent the clear-button and the select-arrow from overlapping when using `FinalFormSelect` with the `clearable` prop.
-   Updated dependencies [dbdc0f55]
    -   @comet/admin-icons@4.7.0

## 4.6.0

### Patch Changes

-   Updated dependencies [c3b7f992]
-   Updated dependencies [c3b7f992]
    -   @comet/admin-icons@4.6.0

## 4.5.0

### Minor Changes

-   6d4ca5bf: Deprecate `Table` component

    The `Table` component has been deprecated in favor of [MUI X Data Grid](https://mui.com/x/react-data-grid/) in combination with `useDataGridRemote`. See [docs](https://storybook.comet-dxp.com/?path=/story/docs-components-table-basics--page) for further information.

-   07d921d2: Add a generic Loading component for use in Admin

    `Loading` handles the positioning of the loading indicator automatically, depending on the set `behaviour` prop.

### Patch Changes

-   46cf5a8b: Fix an issue that caused `useDataGridRemote()` to ignore its URL params when `queryParamsPrefix` was set
-   8a2c3302: Correctly position loading indicators by centring them using the new `Loading` component
    -   @comet/admin-icons@4.5.0

## 4.4.3

### Patch Changes

-   @comet/admin-icons@4.4.3

## 4.4.2

### Patch Changes

-   @comet/admin-icons@4.4.2

## 4.4.1

### Patch Changes

-   662abcc9: Prevent the `MainContent` component from having an invalid height.

    This bug would cause the page tree to have no height when navigating into a page and then navigating back again.

    -   @comet/admin-icons@4.4.1

## 4.4.0

### Minor Changes

-   e824ffa6: Add `fullHeight` & `disablePadding` props to MainContent

    `fullHeight` makes MainContent take up the remaining space below to fill the entire page.
    This is helpful for virtualized components that need a fixed height, such as DataGrid or the PageTree.

    `disablePadding` is helpful if a component requires the `fullHeight` behaviour but should fill the entire page without the surrounding space.

-   3e15b819: Add field components to simplify the creation of forms with final-form.

    -   TextField
    -   TextAreaField
    -   SearchField
    -   SelectField
    -   CheckboxField
    -   SwitchField
    -   ColorField
    -   DateField
    -   DateRangeField
    -   TimeField
    -   TimeRangeField
    -   DateTimeField

    **Example with TextField**

    ```tsx
    // You can now do:
    <TextField name="text" label="Text" />
    ```

    ```tsx
    // Instead of:
    <Field name="text" label="Text" component={FinalFormInput} />
    ```

    **Example with SelectField**

    ```tsx
    // You can now do:
    <SelectField name="select" label="Select">
        {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
                {option.label}
            </MenuItem>
        ))}
    </SelectField>
    ```

    ```tsx
    // Instead of:
    <Field name="select" label="Select">
        {(props) => (
            <FinalFormSelect {...props}>
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </FinalFormSelect>
        )}
    </Field>
    ```

-   a77da844: Add little helper for mui grid pagination (muiGridPagingToGql)

    Sample usage:

    ```
    const { data, loading, error } = useQuery<GQLProductsListQuery, GQLProductsListQueryVariables>(productsQuery, {
        variables: {
            ...muiGridFilterToGql(columns, dataGridProps.filterModel),
            ...muiGridPagingToGql({ page: dataGridProps.page, pageSize: dataGridProps.pageSize }),
            sort: muiGridSortToGql(sortModel),
        },
    });
    ```

### Patch Changes

-   @comet/admin-icons@4.4.0

## 4.3.0

### Patch Changes

-   @comet/admin-icons@4.3.0

## 4.2.0

### Minor Changes

-   3567533e: Add componentsProps to EditDialog
-   d25a7cbb: Allow disabling `RowActionsItem` using a `disabled` prop.

### Patch Changes

-   67e54a82: Add styling variants to Tooltip
-   7b614c13: Add styleOverrides to ToolbarAutomaticTitleItem
-   aaf1586c: Fix multiple prop in FinalFormAutocomplete
    -   @comet/admin-icons@4.2.0

## 4.1.0

### Minor Changes

-   51466b1a: Add initial sort to `useDataGridRemote` hook
-   51466b1a: Add optional prop `disableCloseAfterSubmit` to `EditDialog`. It prevents the default closing behavior of `EditDialog`.
-   51466b1a: Add optional prop `onAfterSave()` to `EditDialog`. It is called after successfully saving a `FinalForm` within the `EditDialog`
-   51466b1a: Added `RowActionsMenu` and `RowActionsItem` components for creating IconButtons with nested Menus and Items for actions in table rows and other listed items.
-   c5f2f918: Add Tooltip Component that adds to MUI Tooltip a trigger prop that allows showing the Tooltip on focus/click without the need for `ClickAwayListener`.

### Patch Changes

-   51466b1a: Add compatible x-data-grid-\* versions as optional peerDependency
-   Updated dependencies [51466b1a]
    -   @comet/admin-icons@4.1.0
