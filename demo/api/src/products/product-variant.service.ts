import { type CrudGeneratorHooksService, type CurrentUser } from "@comet/cms-api";

import { type ProductVariant } from "./entities/product-variant.entity";
import { type ProductVariantInput, type ProductVariantUpdateInput } from "./generated/dto/product-variant.input";

export class ProductVariantService implements CrudGeneratorHooksService {
    async validateCreateInput(input: ProductVariantInput, options: { currentUser: CurrentUser; args: { product: string } }): Promise<void> {
        if (input.name.length < 3 && options.currentUser.email !== "foo@example.com") {
            throw new Error("Title must be at least 3 characters long when creating a product variant, except for foo");
        }
        // we could access options.args.product here if needed
    }
    async validateUpdateInput(input: ProductVariantUpdateInput, options: { currentUser: CurrentUser; entity: ProductVariant }): Promise<void> {
        if (input.name !== undefined && input.name.length < 3 && options.currentUser.email !== "foo@example.com") {
            throw new Error("Title must be at least 3 characters long when updating a product variant, except for foo");
        }
        // we could access options.entity here if needed
    }
}
