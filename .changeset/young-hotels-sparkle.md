---
"@comet/cms-api": minor
---

Add a console script to import redirects from a csv file

You can use the script like this: `npm run console import-redirects file-to-import.csv`

The CSV file must look like this:

```csv
source;target;target_type;comment;scope_domain
/test-source;/test-target;internal;Internal Example;main
/test-source-external;https://www.comet-dxp.com/;external;External Example;secondary
```
