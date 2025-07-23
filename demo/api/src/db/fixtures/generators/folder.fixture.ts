import { type FolderInterface, type FoldersService } from "@comet/cms-api";
import { faker } from "@faker-js/faker";

export class FolderFixture {
    constructor(private foldersService: FoldersService) {}
    async generateFolder(parentId: string | null = null): Promise<FolderInterface> {
        const folder = this.foldersService.create({
            parentId: parentId ?? undefined,
            name: faker.lorem.word(),
        });

        return folder;
    }

    async randomlyGenerateFolders(amount = 5): Promise<FolderInterface[]> {
        const parentIds: Array<string | null> = [null];
        const folders: FolderInterface[] = [];

        for (let i = 0; i < amount; i++) {
            const parentId = this.getRandomArrayItem(parentIds);
            const folder = await this.generateFolder(parentId);

            parentIds.push(folder.id);
            folders.push(folder);
        }

        return folders;
    }

    private getRandomArrayItem(arr: Array<string | null>): string | null {
        return arr[Math.floor(Math.random() * arr.length)];
    }
}
