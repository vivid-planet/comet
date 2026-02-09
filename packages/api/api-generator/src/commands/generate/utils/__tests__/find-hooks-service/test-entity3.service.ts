import { type CrudGeneratorHooksService } from "@comet/cms-api";

import { type TestEntity3MutationError } from "./test-entity3-error";

export class TestEntity3Service implements CrudGeneratorHooksService {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async validateCreateInput(input: any): Promise<TestEntity3MutationError[]> {
        return [];
    }
}
