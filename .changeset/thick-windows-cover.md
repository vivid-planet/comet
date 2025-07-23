---
"@comet/cms-api": major
---

Replace nestjs-console with nest-commander

The [nestjs-console](https://github.com/Pop-Code/nestjs-console) package isn't actively maintained anymore.
We therefore replace it with [nest-command](https://nest-commander.jaymcdoniel.dev/).

To upgrade, perform the following steps:

1. Uninstall `nestjs-console`
2. Install `nest-commander` and `@types/inquirer`
3. Update `api/src/console.ts` to use `nest-commander`
4. Update your commands to the new `nest-commander` syntax

See the migration guide for more information.
