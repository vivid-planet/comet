---
title: Migrating from v5 to v6
sidebar_position: 1
---

# Migrating from v5 to v6

## API

### JobStatus

The `JobStatus` enum was renamed to `KubernetesJobStatus`.

## Admin

### BuildRuntime

The `BuildRuntime` component was renamed to `JobRuntime`.

### @comet/admin

#### FinalForm

Previously, `FinalForm#onAfterSubmit()` automatically executed

```ts
stackApi?.goBack();
editDialog?.closeDialog({ delay: true });
```

This was removed because it was often unwanted and overridden. 

**You need to:**

1. Add following code if you still want the old behavior:

    ```tsx
    const stackApi = React.useContext(StackApiContext);
    const editDialog = React.useContext(EditDialogApiContext);
   
    // ...
   
    <FinalForm
        onAfterSubmit={() => {
            stackApi?.goBack();
            editDialog?.closeDialog({ delay: true });
        }}
    >
    ```

2. You can remove workarounds like

    ```tsx
    <FinalForm
        onAfterSubmit={() => {
            //don't go back automatically
        }}
    />
    ```

### @comet/admin-icons

The icons `Betrieb`, `LogischeFilter`, `Pool`, `Pool2`, `Vignette1`, `Vignette2`, `StateGreen`, `StateGreenRing`, `StateOrange`, `StateOrangeRing`, `StateRed` and `StateRedRing` were removed.

If you used any of these icons in your app, you must add them to your project. You can download them [here](https://github.com/vivid-planet/comet/tree/76e50aa86fd69b1df79825967c6c5c50e2cb6df7/packages/admin/admin-icons/icons/deprecated).


## Site


## ESLint

**Both new rules are auto-fixable.** All errors can be fixed by executing `npm run lint:eslint -- --fix` in `/api`, `/admin` and `/site`.

### @comet/no-other-module-relative-import

The `@comet/no-other-module-relative-import` rule is now enabled by default. It enforces absolute imports when importing from other modules.

```diff
- import { AThingInModuleA } from "../moduleA/AThingInModuleA"
+ import { AThingInModuleA } from "@src/moduleA/AThingInModuleA"
```

### import/newline-after-import

The `import/newline-after-import` rule is now enabled by default. It enforces adding a blank line between imports and code.

## New Features

### Cron Jobs

The `CronJobsPage` now

- shows the last run of every job
- has a button to manually trigger a job
- offers a subpage that displays all job runs

You must add the `CronJobsModule` to your `AppModule` in the API for the `CronJobsPage` to work.

:::warning

Ensure you have sufficient access controls in place to prevent anyone from triggering cron jobs.

:::
