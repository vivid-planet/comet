import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

import { PageTreeService } from "../../page-tree/page-tree.service";
import { RedirectValidationArguments } from "../dto/redirect.input";
import { RedirectSourceTypeValues } from "../redirects.enum";

export const MustNotCreateRedirectLoop = (validationOptions?: ValidationOptions) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (object: Record<string, any>, propertyName: string): void => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: MustNotCreateRedirectLoopConstraint,
        });
    };
};

@ValidatorConstraint({ name: "MustNotCreateRedirectLoop", async: true })
@Injectable()
export class MustNotCreateRedirectLoopConstraint implements ValidatorConstraintInterface {
    @Inject(forwardRef(() => PageTreeService))
    private pageTreeService: PageTreeService;

    async validate(targetPageId: string, validationArguments: RedirectValidationArguments): Promise<boolean> {
        const sourceType = validationArguments.object.sourceType;
        if (sourceType !== RedirectSourceTypeValues.path) {
            return true;
        }

        const readApi = this.pageTreeService.createReadApi({ visibility: "all" });
        const targetPage = await readApi.getNodeOrFail(targetPageId);
        const targetPath = await readApi.nodePath(targetPage);
        const sourcePath = validationArguments.object.source;
        return sourcePath !== targetPath;
    }

    defaultMessage(): string {
        return `redirect must not create redirect loop`;
    }
}
