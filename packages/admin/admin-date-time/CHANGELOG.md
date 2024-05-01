# @comet/admin-date-time

## 4.9.0

### Patch Changes

-   @comet/admin@4.9.0
-   @comet/admin-icons@4.9.0

## 4.8.1

### Patch Changes

-   @comet/admin@4.8.1
-   @comet/admin-icons@4.8.1

## 4.8.0

### Patch Changes

-   @comet/admin@4.8.0
-   @comet/admin-icons@4.8.0

## 4.7.2

### Patch Changes

-   @comet/admin@4.7.2
-   @comet/admin-icons@4.7.2

## 4.7.1

### Patch Changes

-   Updated dependencies [56b33ff3]
    -   @comet/admin@4.7.1
    -   @comet/admin-icons@4.7.1

## 4.7.0

### Patch Changes

-   Updated dependencies [dbdc0f55]
-   Updated dependencies [eac9990b]
-   Updated dependencies [fe310df8]
-   Updated dependencies [fde8e42b]
    -   @comet/admin-icons@4.7.0
    -   @comet/admin@4.7.0

## 4.6.0

### Patch Changes

-   Updated dependencies [c3b7f992]
-   Updated dependencies [c3b7f992]
    -   @comet/admin-icons@4.6.0
    -   @comet/admin@4.6.0

## 4.5.0

### Patch Changes

-   Updated dependencies [46cf5a8b]
-   Updated dependencies [8a2c3302]
-   Updated dependencies [6d4ca5bf]
-   Updated dependencies [07d921d2]
    -   @comet/admin@4.5.0
    -   @comet/admin-icons@4.5.0

## 4.4.3

### Patch Changes

-   @comet/admin@4.4.3
-   @comet/admin-icons@4.4.3

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
