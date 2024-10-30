---
"@comet/cms-site": patch
---

Fix preview overlay not updating on style-only changes

Previously, the preview overlay would only update when the HTML structure changed or the window was resized.
Now it also responds to attribute changes, including `class` modifications, ensuring the overlay updates correctly when elements are repositioned through CSS.
