/*
    Inspired by `mergeClasses` from "@material-ui/styles` (https://github.com/mui-org/material-ui/blob/master/packages/material-ui-styles/src/mergeClasses/mergeClasses.js)
    Only here, `newClasses` can be `undefined` and there is no `Component` required in the parameters.
*/

type Classes<ClassKeys extends string = string> = {
    [key in ClassKeys]: string;
};

type NewClasses<ClassKeys extends string = string> = Partial<Classes<ClassKeys>>;

export function mergeClasses<ClassKeys extends string = string>(
    baseClasses: Classes<ClassKeys>,
    newClasses: NewClasses<ClassKeys> | undefined,
): Classes<ClassKeys> {
    const combinedClasses = baseClasses;

    if (newClasses) {
        for (const key in newClasses) {
            combinedClasses[key] += ` ${newClasses[key]}`;
        }
    }

    return combinedClasses;
}
