# Changelog

All notable changes to this project will be documented in this file. This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [next]

## @comet/admin

### Highlights

-   Added a new InputBase (`CometAdminInputBase`) for use in all custom input-components in Comet
-   Added `ClearInputButton`, this component can be used as `endAdornment`, to clear inputs
    -   Can be themed with `CometAdminClearInputButton` (props and overrides)
-   New methods of customization and default layout for `Field`
    -   Added theme-augmentation for `FieldContainer`
    -   New `variant` prop to select between vertical and horizontal positioning of label and input
    -   Label is now positioned above input by default (`variant={"vertical"}`)
-   The Menu component and it's items can be customized using the material-ui theme
    -   Allows custom styling of the Menu, MenuItem and MenuCollapsibleItem _(theme -> overrides -> CometAdminMenu/CometAdminMenuItem/CometAdminMenuCollapsibleItem)_
    -   Allows using custom open/close icons for CollapsibleItem _(theme -> props -> CometAdminMenuCollapsibleItem -> openedIcon/closedIcon)_
-   The MasterLayout component can be customized using the material-ui theme
    -   Using the new `headerHeight` prop, the top-spacing of the content and the menu, will now be adjusted automatically
-   add new package @comet/admin-icons
-   add onAfterSubmit to FinalForm
-   add useStoredState() hook

### Incompatible Changes

-   Replaced form/Input (`VPAdminInputBase`) with form/InputBase (`CometAdminInputBase`)
    -   Deprecated `getDefaultVPAdminInputStyles` because the styled are included in InputBase, which should be used for all custom inputs in Comet
-   Usage and default layout of `Field` has changed
    -   The `fieldContainer` prop has been removed, in favour of the `variant` prop and theme-augmentation of `CometAdminFormFieldContainer`
    -   Removed `FieldContainerLabelAbove` component (the new default looks like this)
    -   The old default layout of `Field` can be restored by adding the following to the theme:
        ```js
        {
            props: {
                CometAdminFormFieldContainer: {
                    variant: 'horizontal'
                }
            },
            overrides: {
                CometAdminFormFieldContainer: {
                    horizontal: {
                        "& $label": {
                            width: `${100 / 3}%`
                        },
                        "& $inputContainer": {
                            width: `${200 / 3}%`
                        }
                    }
                }
            }
        }
        ```
-   Changes to Menu component
    -   Removed default styling in favour of the ability to style the component using the theme without the need to override these default styles
    -   Removed the `permanentMenuMinWidth` prop, now `variant` can be passed instead
        -   This allows for more control, like giving certain pages more width by always using the temporary variant on those pages
    -   Allows maximum item-nesting of two levels
-   Changes to MasterLayout
    -   The default values for content-spacing and header-height have changed slightly

## @comet/admin-color-picker

### Highlights

-   Allow custom icons/adornment for color-input
-   The clear-button is now optional (using the `showClearButton` prop)

### Incompatible Changes

-   Renamed `VPAdminColorPicker` to `CometAdminColorPicker`
-   Removed `clearButton` and `clearIcon` classes from color-picker
    -   Using theme-augmentation the new common clear-button can now be styled with `CometAdminClearInputButton` instead of `VPAdminColorPicker`
-   The clear-button is no longer shown by default
-   Removed `clearButton` and `clearIcon` classes from color-picker
    -   Using theme-augmentation the new common clear-button can now be styled with `CometAdminClearInputButton` instead of `VPAdminColorPicker`

## @comet/admin-react-select

### Highlights

-   Added theming-ability for input with `CometAdminInputBase`

### Incompatible Changes

-   Renamed theme-key from `VPAdminSelect` to `CometAdminSelect`

## @comet/admin-rte

### Highlights

-   Add ability to customize the styling using theme-overrides
