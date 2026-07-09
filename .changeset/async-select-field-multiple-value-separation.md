---
"@comet/admin": patch
---

Fix separation of multiple selected values in `FinalFormSelect`

When using `multiple`, the selected values were rendered concatenated without any separator (e.g. `value-2value-1value-3value-4`). They are now separated by a comma, matching the display of `SelectField`.

This affects all fields that render their selected values through the options/`getOptionLabel` path (i.e. without JSX `children`), namely `AsyncSelectField` and any `FinalFormSelect` used with an array value. Within Comet, this also corrects the display of the `targetGroups` and test email address selects in `@comet/brevo-admin` (`SendManagerFields`, `TestEmailCampaignForm`), which consume `FinalFormSelect` and had the same issue.
