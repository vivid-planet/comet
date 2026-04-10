# Layout Patterns

## Two-Column Layout (Equal Width)

Two equal-width columns with a gap between them, stacking vertically on mobile.

### How Column Gaps Work

MJML has no `gap` property. Column padding reduces the content area _inside_ the column — it doesn't create space between column cells. To create a visible gap, apply padding to the inner edges of adjacent columns: `paddingRight` on the left column and `paddingLeft` on the right column. Their sum becomes the gap.

**Do not** apply equal padding on all sides of every column. This adds extra outer-edge spacing that compounds with `indent`/`contentIndentation`, pushing content inward.

### Pattern

Apply half the gap to each column's inner edge. Both columns have the same total padding, so MJML's default equal-width split produces equal content areas without explicit `width` props:

```tsx
const TwoColumnsSection = () => {
    const columnGap = 20;
    const halfGap = columnGap / 2;

    return (
        <MjmlSection indent className="twoColumnsSection">
            <MjmlColumn className="twoColumnsSection__leftColumn" paddingRight={halfGap}>
                <MjmlText>Left column content.</MjmlText>
            </MjmlColumn>
            <MjmlColumn className="twoColumnsSection__rightColumn" paddingLeft={halfGap}>
                <MjmlText>Right column content.</MjmlText>
            </MjmlColumn>
        </MjmlSection>
    );
};
```

### Responsive Stacking

On mobile, columns stack vertically. Reset the gap padding so content stretches full-width, and add a vertical margin between the stacked columns:

```ts
registerStyles(
    (theme) => css`
        ${theme.breakpoints.mobile.belowMediaQuery} {
            .twoColumnsSection__leftColumn > table > tbody > tr > td {
                padding-right: 0 !important;
            }

            .twoColumnsSection__rightColumn > table > tbody > tr > td {
                padding-left: 0 !important;
            }

            .twoColumnsSection__leftColumn {
                margin-bottom: 20px;
            }
        }
    `,
);
```

### CSS Targeting Rules

- **Column padding** compiles to an inner `<td>`, not the outer `<div>` that receives `className`. Override padding via `.className > table > tbody > tr > td`.
- **`margin-bottom`** goes on the column wrapper itself (the outer `<div>`), so `.twoColumnsSection__leftColumn` without the table path is correct.
- **`!important`** is required on all responsive overrides — MJML inlines styles that take precedence over `<style>` block rules.
- Prefer `theme.breakpoints.mobile.belowMediaQuery` over hardcoded media queries.

### BEM Class Naming

Follow the BEM convention with camelCase blocks:

| Element         | Class name                       |
| --------------- | -------------------------------- |
| Section wrapper | `twoColumnsSection`              |
| Left column     | `twoColumnsSection__leftColumn`  |
| Right column    | `twoColumnsSection__rightColumn` |

Adapt the block name to the component context (e.g., `featureComparison__leftColumn` for a feature comparison section).
