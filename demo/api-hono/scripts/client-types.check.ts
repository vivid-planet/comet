/**
 * Type-level checks of the typed client, verified by `tsc` (lint:tsc). Never executed.
 */
import { createApiClient } from "dextinity-demo-api-hono/client";

const api = createApiClient("http://localhost");

export async function checks() {
    // @ts-expect-error The scope dimension "domain" of the demo's DamScope is required
    await api.dam.items.$get({ query: { folderId: "…" } });

    // @ts-expect-error Unknown sort column
    await api.dam.files.$get({ query: { domain: "main", sortColumnName: "unknown" } });

    const response = await api.dam.files[":id"].$get({ param: { id: "…" } });
    if (response.ok) {
        const file = await response.json();
        const domain: string = file.scope.domain;
        const urlTemplate: string | undefined = file.image?.urlTemplate;
        // @ts-expect-error The demo's DamScope has no language
        const language: string = file.scope.language;
        return { domain, urlTemplate, language };
    }
}
