# Changelog

All notable changes to this project will be documented in this file. This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [next]

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

## [1.0.2] - 23. Feb 2021

use fixed version of react-color
switched from yarn to npm 7 (updated all dependencies)

## [1.0.1] - 12. Jan 2021 - re-release under new name

This package has been renamed to @comet/admin-color-picker

## [1.0.1] - 11. Jan 2021

This is a bugfix/maintenance release

## [1.0.0] - 22. Dec 2020

This version ist the first stable version.
