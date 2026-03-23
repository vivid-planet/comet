# @comet/mail-react

Utilities for building HTML emails with React and MJML.

## Spec-driven development with OpenSpec

This package uses [OpenSpec](https://github.com/Fission-AI/OpenSpec) for spec-driven development. Specs and change history live in `openspec/` and are committed to the repo.

## Getting started

- Run `./install.sh` from the project root to install dependencies and configure OpenSpec agent skills
- Open the `packages/mail-react/` directory directly in the IDE, as OpenSpec does not currently support monorepos

## Suggested development workflow

- Use `/opsx:explore` to think through ideas before proposing
- Use `/opsx:propose` to propose a change, then commit the proposal
- Use `/opsx:apply` to apply the change, then commit the result
- Use `/opsx:archive` to archive the change and merge delta specs into the main specs, then commit

Minor fixes may skip this workflow.

## Suggested review workflow

- A pull request should propose, apply, and archive a change in one go
- Reviewers can then focus on the code changes and resulting spec, skimming the archived implementation details
