---
"@comet/admin": minor
---

Add `disabled` support to `ToggleButtonGroupField`

Setting `disabled` on the field was accepted but had no effect — every button stayed clickable. It now disables all buttons, and individual options can be disabled by setting `disabled` on the option. When both are set, the field wins — an option cannot re-enable itself.

**Example**

```tsx
<ToggleButtonGroupField
    name="type"
    options={[
        { label: "Address", value: "address" },
        { label: "Coordinates", value: "coordinates", disabled: true },
    ]}
/>
```

`FinalFormToggleButtonGroup` now also supports `sx`, `className`, `slotProps` and theme customization through `CometAdminFinalFormToggleButtonGroup`, with the new `FinalFormToggleButtonGroupClassKey` type describing its slots.
