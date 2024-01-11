---
"@comet/cms-api": minor
---

Deprecate `download` helper

The helper is primarily used to create a `FileUploadInput` (previously `FileUploadInterface`) input for `FilesService#upload` while creating fixtures.
However, the name of the helper is too generic to be part of the package's public API.
Instead, use the newly added `FileUploadService#createFileUploadInputFromUrl`.

**Example:**

```ts
@Injectable()
class ImageFixtureService {
    constructor(private readonly filesService: FilesService, private readonly fileUploadService: FileUploadService) {}

    async generateImage(url: string): Promise<FileInterface> {
        const upload = await this.fileUploadService.createFileUploadInputFromUrl(url);
        return this.filesService.upload(upload, {});
    }
}
```
