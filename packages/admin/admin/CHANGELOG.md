# @comet/admin

## 4.8.0

### Patch Changes

-   @comet/admin-icons@4.8.0

## 4.7.2

### Patch Changes

-   @comet/admin-icons@4.7.2

## 4.7.1

### Patch Changes

-   56b33ff3: Fix `submit` implementation for `DirtyHandler` in `FinalForm`

    The submit mutation wasn't correctly awaited if a `FinalForm` using an asynchronous validation was saved via the `saveAction` provided in the `RouterPrompt`.

    In practice, this affected `FinalForm`s within an `EditDialog`. The `EditDialog` closed before the submission was completed. All changes were omitted. The result of the submission (fail or success) was never shown.

    -   @comet/admin-icons@4.7.1

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
