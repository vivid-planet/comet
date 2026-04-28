---
title: Installing the Claude Code plugin
---

# Installing the Claude Code plugin

Comet ships a [Claude Code](https://docs.claude.com/en/docs/claude-code/overview) plugin that bundles the agent skills (e.g. `comet-block`, `comet-mail-react`) into a single installable unit. Once installed, Claude Code picks the skills up automatically — there is no need to maintain an `agent-skills.json` file or run `install-agent-skills` for them.

This guide is for developers using Claude Code as their AI coding assistant. If you want to use the skills with a different agent, or you cannot install plugins (e.g. CI environments), use [Installing agent skills](./5-installing-agent-skills.md) instead.

## Prerequisites

- [Claude Code](https://docs.claude.com/en/docs/claude-code/setup) installed and signed in.
- Network access to `github.com` (the plugin is fetched from the public Comet repository).

## Install

Register the Comet marketplace once per machine:

```text
/plugin marketplace add vivid-planet/comet
```

Then install the `comet` plugin from it:

```text
/plugin install comet@comet-plugin-marketplace
```

Reload Claude Code to activate the plugin:

```text
/reload-plugins
```

After activation, the bundled skills become available to Claude Code automatically — there is no per-project setup.

## What's included

The plugin currently provides these agent skills:

| Skill              | Use when working with…                                |
| ------------------ | ----------------------------------------------------- |
| `comet-block`      | Comet blocks (API, Admin, Site) and block fixtures    |
| `comet-mail-react` | HTML emails built with `@comet/mail-react` and MJML   |

New skills are added over time; running `/plugin update comet` (see below) pulls them in.

## Updating

Claude Code refreshes installed marketplaces on startup. To update manually:

```text
/plugin marketplace update comet-plugin-marketplace
/plugin update comet
/reload-plugins
```

## Uninstalling

```text
/plugin uninstall comet
/plugin marketplace remove comet-plugin-marketplace
```

## Local development

The plugin lives in the Comet repository under [`agentic-plugin/`](https://github.com/vivid-planet/comet/tree/main/agentic-plugin):

```
agentic-plugin/
├── .claude-plugin/
│   └── plugin.json     # plugin manifest (loaded when the plugin is active)
└── skills/
    ├── comet-block/
    │   └── SKILL.md
    └── comet-mail-react/
        └── SKILL.md
```

To test plugin changes against a local checkout without publishing, point Claude Code at the directory:

```sh
claude --plugin-dir /path/to/comet/agentic-plugin
```

Changes to files in `agentic-plugin/` take effect after restarting Claude Code (or running `/reload-plugins`).

## Plugin vs. agent skills

Both delivery mechanisms use the same skill files under `agentic-plugin/skills/` — pick whichever matches your setup:

| Approach                                             | Best for                                                                                  |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Claude Code plugin (this guide)                      | Individual developers using Claude Code, who want the skills available in every project.  |
| [Agent skills](./5-installing-agent-skills.md)       | Per-project installs, agents other than Claude Code, or CI environments without Claude Code. |
