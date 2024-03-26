# @comet/admin

## 5.6.6

### Patch Changes

-   47630cc64: Fix a crash when using the `Alert` component inside a MUI `Snackbar`
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
