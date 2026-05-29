# Divider

MJML's built-in `mj-divider` paints its line via `border-top`, which leaves no room for a gradient overlay and pins consumers to upstream's prop surface. `MjmlDivider` and `HtmlDivider` instead render a `<table>`/`<td>` pair where the colored bar lives in the cell's `background-color`. Height, `backgroundColor`, and `backgroundImage` come from `theme.divider`. A theme `backgroundImage` (typically a gradient) sits on top of the `backgroundColor` fallback so clients that ignore `background-image` still render the solid color.

## Non-goals

- No `padding` prop. The line sits flush against the column edge; consumers add spacing with the surrounding section or column.
- No vector-rendered line for legacy Outlook. Outlook honors the table-cell pattern (with `mso-line-height-rule: exactly`) reliably enough that the extra VML conditional that upstream `mj-divider` ships isn't worth maintaining here.
