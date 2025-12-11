---
"@comet/api-generator": minor
---

Add support for hooksService that allows injecting a custom service into update/create mutation for custom validation logic

Usage example:

```
export class ProductService implements CrudGeneratorHooksService {
    async validateCreateInput(input: ProductInput, options: { currentUser: CurrentUser, scope: Scope, args: { department: string } }): Promise<void> {
        //add custom validation logic here
    }
    async validateUpdateInput(input: ProductInput, options: { currentUser: CurrentUser, entity: Product }): Promise<void> {
        //add custom validation logic here
    }
}

@CrudGenerator({ .... hooksService: ProductService })
class Products ...
```
