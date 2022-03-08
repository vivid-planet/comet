import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

import { PageTreeService } from "../../page-tree/page-tree.service";

export const PageExists = (validationOptions?: ValidationOptions) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (object: Record<string, any>, propertyName: string): void => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: PageExistsConstraint,
        });
    };
};

@ValidatorConstraint({ name: "PageExists", async: true })
@Injectable()
export class PageExistsConstraint implements ValidatorConstraintInterface {
    @Inject(forwardRef(() => PageTreeService))
    private pageTreeService: PageTreeService;

    async validate(id: string): Promise<boolean> {
        return !!(await this.pageTreeService.createReadApi({ visibility: "all" }).getNodeOrFail(id));
    }

    defaultMessage(): string {
        return `page with this targetPageId does not exist`;
    }
}
