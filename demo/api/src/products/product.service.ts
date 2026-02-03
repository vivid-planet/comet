import { type CrudGeneratorHooksService, type CurrentUser, type MutationError } from "@comet/cms-api";

import { type ProductInput } from "./generated/dto/product.input";

export class ProductService implements CrudGeneratorHooksService {
    async validateCreateInput(input: ProductInput, options: { currentUser: CurrentUser }): Promise<MutationError[]> {
        if (input.title.length < 3 && options.currentUser.email !== "foo@example.com") {
            return [
                {
                    message: "Title must be at least 3 characters long when creating a product, except for foo",
                    code: "TITLE_TOO_SHORT",
                    field: "title",
                },
            ];
        }
        return [];
    }
}
