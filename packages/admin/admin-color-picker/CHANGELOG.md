# @comet/admin-color-picker

## 4.4.2

### Patch Changes

-   @comet/admin@4.4.2
-   @comet/admin-icons@4.4.2

## 4.4.1

### Patch Changes

-   Updated dependencies [662abcc9]
    -   @comet/admin@4.4.1
    -   @comet/admin-icons@4.4.1

## 4.4.0

### Minor Changes

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

### Patch Changes

-   Updated dependencies [e824ffa6]
-   Updated dependencies [3e15b819]
-   Updated dependencies [a77da844]
    -   @comet/admin@4.4.0
    -   @comet/admin-icons@4.4.0

## 4.3.0

### Patch Changes

-   @comet/admin@4.3.0
-   @comet/admin-icons@4.3.0

## 4.2.0

### Patch Changes

-   Updated dependencies [67e54a82]
-   Updated dependencies [3567533e]
-   Updated dependencies [7b614c13]
-   Updated dependencies [aaf1586c]
-   Updated dependencies [d25a7cbb]
    -   @comet/admin@4.2.0
    -   @comet/admin-icons@4.2.0

## 4.1.0

### Patch Changes

-   Updated dependencies [51466b1a]
-   Updated dependencies [51466b1a]
-   Updated dependencies [51466b1a]
-   Updated dependencies [51466b1a]
-   Updated dependencies [51466b1a]
-   Updated dependencies [51466b1a]
-   Updated dependencies [c5f2f918]
    -   @comet/admin@4.1.0
    -   @comet/admin-icons@4.1.0
