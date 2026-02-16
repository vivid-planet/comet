import { type CrudGeneratorHooksService, type CurrentUser } from "@comet/cms-api";

import { type ProductInput } from "./generated/dto/product.input";

export class ProductService implements CrudGeneratorHooksService {
    async validateCreateInput(input: ProductInput, options: { currentUser: CurrentUser }): Promise<void> {
        if (input.title.length < 3 && options.currentUser.email !== "foo@example.com") {
            throw new Error("Title must be at least 3 characters long when creating a product, except for foo");
        }
    }
}
