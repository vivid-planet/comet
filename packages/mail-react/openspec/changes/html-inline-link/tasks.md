## 1. OutlookTextStyleContext

- [ ] 1.1 Create `src/components/text/OutlookTextStyleContext.tsx` with `OutlookTextStyleValues` type, `OutlookTextStyleProvider` component, and `useOutlookTextStyle` hook
- [ ] 1.2 Verify `OutlookTextStyleValues`, `OutlookTextStyleProvider`, and `useOutlookTextStyle` are NOT exported from `src/index.ts` (internal only)

## 2. Integrate OutlookTextStyleProvider into text components

- [ ] 2.1 Update `HtmlText` to wrap children in `OutlookTextStyleProvider` with resolved text style values
- [ ] 2.2 Update `MjmlText` to wrap children in `OutlookTextStyleProvider` with resolved text style values (only when a theme is present)
- [ ] 2.3 Verify existing `HtmlText` and `MjmlText` tests still pass

## 3. HtmlInlineLink component

- [ ] 3.1 Create `src/components/inlineLink/HtmlInlineLink.tsx` with `HtmlInlineLinkProps` type, `HtmlInlineLink` component, `htmlInlineLink` block class via `clsx`, and `registerStyles` call for the responsive inherit reset at `theme.breakpoints.default.belowMediaQuery`
- [ ] 3.2 Export `HtmlInlineLink` and `HtmlInlineLinkProps` from `src/index.ts`
- [ ] 3.3 Add TSDoc comments to `HtmlInlineLink` and `HtmlInlineLinkProps`

## 4. Stories

- [ ] 4.1 Create `src/components/inlineLink/__stories__/HtmlInlineLink.stories.tsx` with stories for in-text usage, custom color override, and standalone fallback

## 5. Changeset

- [ ] 5.1 Create changeset file in `.changeset/` at the monorepo root describing the new `HtmlInlineLink` component
