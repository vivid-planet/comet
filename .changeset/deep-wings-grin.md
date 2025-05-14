---
"@comet/admin": major
"@comet/cms-api": major
---

Add Warning Module Feature

- Central grid view in admin panel for all warnings
- Built-in warnings for common issues (e.g. missing SEO titles)
- Custom warning support for blocks and entities
- Configurable severity levels
- Direct navigation to issues for quick fixes

The Warning Module can be added to the project with the following changes:

1. **Register the Warning Module in your API**  
   Add `WarningsModule` to the `imports` array in your `app.module.ts`:

    ```typescript
    import { WarningsModule } from "@comet/cms-api";

    return {
        module: AppModule,
        imports: [
            // other modules...
            WarningsModule,
        ],
    };
    ```

2. **Add the Warnings page to the admin menu**  
   Add a route entry for warnings to your admin `masterMenu`:

    ```typescript
    {
            type: "route",
            primary: <FormattedMessage id="menu.warnings" defaultMessage="Warnings" />,
            route: {
                    path: "/system/warnings",
                    component: WarningsPage,
            },
            requiredPermission: "warnings",
    }
    ```

3. **Schedule the daily warning check**  
   Set up a cronjob to run the following command once per day:

    ```
    npm run console check-warnings
    ```

4. **Implement custom warnings (optional)**

    - For blocks: Add a `warnings()` function or a service implementing `BlockWarningsServiceInterface`.
    - For entities: Use the `@CreateWarnings` decorator or a service implementing `CreateWarningsServiceInterface`.

5. **Translate warning messages in the admin**  
   Map your warning message keys to translations in `CometConfigProvider`:

    ```tsx
    <CometConfigProvider
        {...otherConfigs}
        warnings={{
            messages: {
                missingTitle: <FormattedMessage id="warnings.missingTitle" defaultMessage="Title is missing" />,
            },
        }}
    />
    ```

See the documentation for more details and advanced usage.
