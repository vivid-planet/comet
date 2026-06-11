# React "does not recognize prop on a DOM element" errors in several admin components (RTE, DatePickerField, PageTree)

- **Severity:** minor
- **Location:** Admin — multiple pages (see occurrences below)

## Summary

Several components forward non-DOM props down to plain DOM elements, producing `React does not recognize the 'X' prop on a DOM element` console errors. Same symptom class, three distinct sources:

### 1. Rich text editor (`@comet/admin-rte`)

Opening any page containing an RTE logs:

```
React does not recognize the `editorRef` prop on a DOM element. ... editorRef editorref
React does not recognize the `editorState` prop on a DOM element. ... editorState editorstate
React does not recognize the `setEditorState` prop on a DOM element. ... setEditorState seteditorstate
```

Reproduce: **Project Snips → Footer** (`/main/en/project-snips/footer`).

### 2. `DatePickerField` (`@comet/admin`)

Opening a form that uses `DatePickerField` (e.g. the generated product form) logs:

```
React does not recognize the `InputLabelProps` prop on a DOM element. ...
React does not recognize the `InputProps` prop on a DOM element. ...
React does not recognize the `fullWidth` prop on a DOM element. ...
React does not recognize the `startAdornment` prop on a DOM element. ...
```

Reproduce: **Generator → Products → New Product** (`/main/en/products`, click "New Product" — the "Created At" `DatePickerField` triggers it) or **Generator → Create Cap Product** (`/main/en/create-cap-product`, logs `InputLabelProps`/`InputProps`). Chain: `DatePickerField` → `Field` → `FinalFormDatePicker` spreads all rest props into `DatePicker` (`packages/admin/admin/src/dateTime/datePickerField/DatePickerField.tsx:7-9`), which passes unknown props to the underlying DOM input.

### 3. Page tree row divider (`@comet/cms-admin`)

Hovering rows in the page tree logs:

```
React does not recognize the `leftSpacing` prop on a DOM element. ... leftSpacing leftspacing
```

Source: `packages/admin/cms-admin/src/pages/pageTree/PageTreeRowDivider.tsx:17` — `styled("div")<Pick<Props, "leftSpacing">>` without `shouldForwardProp`, so `leftSpacing` is forwarded to the `div`.

Reproduce: **Page tree → Main navigation** (`/main/en/pages/pagetree/main-navigation`), hover a page row.

## Expected vs. actual behavior

- **Expected:** Custom/styling props are consumed (or filtered via `shouldForwardProp`/destructuring) before reaching DOM elements; no console errors.
- **Actual:** Each of the listed pages logs unknown-prop errors on render/hover.

## Evidence

- Screenshots: [screenshots/005-rte-footer.png](screenshots/005-rte-footer.png), [screenshots/005-product-add-form.png](screenshots/005-product-add-form.png), [screenshots/005-pagetree-hover.png](screenshots/005-pagetree-hover.png)
- Screencast (all three occurrences in sequence): [screencasts/005-react-unknown-prop-leaks.webm](screencasts/005-react-unknown-prop-leaks.webm)
