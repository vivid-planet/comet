---
"@comet/admin": major
---

Change type of props `openedIcon` and `closedIcon` of `CollapsibleItem` to `React.JSXElementConstructor<SvgIconProps>`

Reason being, the icons need to be called as JSX element to be able to dynamically add classes.
