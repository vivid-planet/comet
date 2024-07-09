import { Injectable } from "@nestjs/common";
import { isString, registerDecorator, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

export const IsValidYoutubeIdentifier = () => {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return (object: Object, propertyName: string): void => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            validator: IsValidYoutubeIdentifierConstraint,
        });
    };
};

const EXPECTED_YT_ID_LENGTH = 11;

@ValidatorConstraint({ name: "IsValidYoutubeIdentifier" })
@Injectable()
export class IsValidYoutubeIdentifierConstraint implements ValidatorConstraintInterface {
    validate(value: unknown): boolean {
        if (!isString(value)) {
            return false;
        }

        // copy of blocks-admin/src/blocks/YouTubeVideoBlock.tsx
        // regex from https://stackoverflow.com/a/51870158
        const regExp =
            /(https?:\/\/)?(((m|www)\.)?(youtube(-nocookie)?|youtube.googleapis)\.com.*(v\/|v=|vi=|vi\/|e\/|embed\/|user\/.*\/u\/\d+\/)|youtu\.be\/)([_0-9a-zA-Z-]+)/;
        const match = value.match(regExp);
        return value.length === EXPECTED_YT_ID_LENGTH || (!!match && match[8].length == EXPECTED_YT_ID_LENGTH);
    }

    defaultMessage(): string {
        return "Invalid YouTube identifier";
    }
}
