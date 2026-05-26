# MjmlMailRoot

Solves the problem that every email template repeats the same boilerplate document skeleton — head, body, breakpoint, attribute defaults, theme and config wiring — by providing a single root component that assembles all of it from the resolved theme and lets templates start at section level.

## Non-goals

- Does not render any visible content of its own; templates supply sections as children.
