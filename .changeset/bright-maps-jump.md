---
"@comet/cms-admin": minor
"@comet/cms-api": minor
---

# Add Support for external DAMs

To implement an external DAM, add a Button-Component with the 
necessary logic (asset-picker, upload-functionality) to the 
/admin/src/dam folder. Next, include the new Component in the 
additionalToolbarItems-Prop of DamPage, in App.tsx.

An example can be found in the Demo-Project.

