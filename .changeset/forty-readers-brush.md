---
"@comet/cms-api": minor
---

Add new extractGraphqlFields helper function that extracts requested fields from GraphQLResolveInfo

Usage example:
```
async products(@Info() info: GraphQLResolveInfo): Promise<PaginatedProducts> {
    const fields = extractGraphqlFields(info, { root: "nodes" });
    const options: FindOptions<Product, any> = { };
    if (fields.includes("category")) options.populate = ["category"];
    //alternative if graphql structure completely matches entities: options.populate = fields;
    const [entities, totalCount] = await this.repository.findAndCount({}, options);
```
