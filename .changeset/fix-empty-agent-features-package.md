---
"@comet/agent-features": patch
---

Fix the package being published without any skills and rules

The `skills/` and `rules/` folders were symlinked to the folders at the repository root. Since pnpm v11 no longer follows symlinked directories when packing, every release since `@comet/agent-features` v9.4.0 contained nothing but the manifest, so `install-agent-features` found no skills or rules to install. The folders are copied into the package when it's built now.
