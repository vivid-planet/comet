---
"@comet/mail-react": minor
---

Fix the stray `mj-text` tag and spacing in the RichText block's nested lists

A nested level rendered a literal `mj-text` tag into the compiled mail, and the text variant's block spacing fell below that level's last item instead of below the whole list.

A nested table no longer carries the variant modifier — scope such a rule to the outermost list's variant, which reaches every level. Two new modifiers name a level directly: `richTextBlock__list--depth<Level>` and `richTextBlock__list--nested`.
