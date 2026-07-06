---
"@comet/site-nextjs": minor
"@comet/site-react": minor
---

Add `JsonLd` component for typed schema.org structured data

Renders any [`schema-dts`](https://www.npmjs.com/package/schema-dts) entity inside a `<script type="application/ld+json">` tag. The payload is escaped so a `</script>` sequence in user content cannot break out of the script tag.

```tsx
import { JsonLd } from "@comet/site-react";
import type { Organization } from "schema-dts";

<JsonLd<Organization>
    data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Acme",
        url: "https://acme.example",
        logo: "https://acme.example/logo.png",
    }}
/>;
```

Also re-exported from `@comet/site-nextjs`.
