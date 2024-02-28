# @comet/cms-api

## 4.8.0

### Minor Changes

-   2ea794fc: Add access logging to log information about the request to standard output. The log contains information about the requester and the request itself. This can be useful for fulfilling legal requirements regarding data integrity or for forensics.

    There are two ways to integrate logging into an application:

    **First option: Use the default implementation**

    ```ts
    imports: [
        ...
        AccessLogModule,
        ...
    ]
    ```

    **Second option: Configure logging**

    Use the `shouldLogRequest` to prevent logging for specific requests. For instance, one may filter requests for system users.

    ```ts
    imports: [
        ...
        AccessLogModule.forRoot({
            shouldLogRequest: ({user, req}) => {
                // do something
                return true; //or false
            },
        }),
        ...
    ]
    ```

    More information can be found in the documentation under 'Authentication > Access Logging'.

### Patch Changes

-   @comet/blocks-api@4.8.0

## 4.7.2

### Patch Changes

-   b201d490: Fix attached document deletion when deleting a page tree node
    -   @comet/blocks-api@4.7.2

## 4.7.1

### Patch Changes

-   @comet/blocks-api@4.7.1

## 4.7.0

### Patch Changes

-   @comet/blocks-api@4.7.0

## 4.6.0

### Patch Changes

-   f6f7d4a4: Prevent slug change of home page in `updateNode()` and `updateNodeSlug()` of `PageTreeService`
    -   @comet/blocks-api@4.6.0

## 4.5.0

### Patch Changes

-   @comet/blocks-api@4.5.0

## 4.4.3

### Patch Changes

-   @comet/blocks-api@4.4.3

## 4.4.2

### Patch Changes

-   896265c1: Fix improper validation of input when creating/updating page tree nodes or redirects
-   cd07c107: Prevent the fileUrl from being exposed in the Site via the PixelImageBlock
    -   @comet/blocks-api@4.4.2

## 4.4.1

### Patch Changes

-   @comet/blocks-api@4.4.1

## 4.4.0

### Minor Changes

-   d4960b05: Add loop toggle to YouTubeVideo block

### Patch Changes

-   53ce0682: get file stats from uploaded file in filestorage
-   11583624: Add content validation for SVG files to prevent the upload of SVGs containing JavaScript
-   Updated dependencies [d4960b05]
    -   @comet/blocks-api@4.4.0

## 4.3.0

### Minor Changes

-   afc7a6b6: Add human readable label for publisher (cron jobs and jobs)
-   b4264f18: Make changes checker scope-aware

### Patch Changes

-   44fbe3f9: add stream end when create files from buffer in filestorage
-   92f23a46: Change propagationPolicy for deleting jobs from default to Background

    Currently we use the default propagationPolicy for deleting jobs. This results in pods from jobs being deleted in k8s but not on OpenShift. With the value fixed to "Background", the jobs should get deleted on every system.
    Foreground would be blocking, so we use Background to be non blocking.

    -   @comet/blocks-api@4.3.0

## 4.2.0

### Minor Changes

-   0fdb1b33: Add new extractGraphqlFields helper function that extracts requested fields from GraphQLResolveInfo

    Usage example:

    ```
    async products(@Info() info: GraphQLResolveInfo): Promise<PaginatedProducts> {
        const fields = extractGraphqlFields(info, { root: "nodes" });
        const options: FindOptions<Product, any> = { };
        if (fields.includes("category")) options.populate = ["category"];
        //alternative if graphql structure completely matches entities: options.populate = fields;
        const [entities, totalCount] = await this.repository.findAndCount({}, options);
    ```

### Patch Changes

-   @comet/blocks-api@4.2.0

## 4.1.0

### Minor Changes

-   51466b1a: Add support for enum types to API CRUD Generator

### Patch Changes

-   51466b1a: Fix page tree node visibility update
    -   @comet/blocks-api@4.1.0
