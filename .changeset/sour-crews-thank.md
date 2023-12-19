---
"@comet/cms-api": minor
---

Deprecate `download` helper

The helper is primarily used to create a `FileUploadInterface` object for `FilesService#upload` while creating fixtures.
However, the name of the helper is too generic to be part of the package's public API.
Instead, use the newly added `FileUploadService#createUploadFromUrl`.

**Example:**

```ts
@Injectable()
class ImageFixtureService {
    constructor(private readonly filesService: FilesService, private readonly fileUploadService: FileUploadService) {}

    async generateImage(url: string): Promise<FileInterface> {
        const upload = await this.fileUploadService.createUploadFromUrl(url);
        return this.filesService.upload(upload, {});
    }
}
```
