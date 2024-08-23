---
"@comet/cms-api": patch
---

Fix bug in `DamVideoBlock` that caused the block to crash if no video file was selected

The block used to crash if no video was selected because the `DamVideoBlockTransformerService` returned an empty object.
This left the `previewImage` state in the admin `undefined` causing `state2Output` to fail.
