// inspired by: https://gist.github.com/Yimiprod/7ee176597fef230d1451#gistcomment-2565071

import { isEqual, isObject, transform } from "lodash";

/**
 * Returns a new object representing the diff between two objects using lodash
 */
function difference<T extends object, TResult>(object: T, base: T): TResult {
    return transform(object, (result, value, key) => {
        if (!isEqual(value, base[key])) {
            // @ts-ignore
            result[key] = isObject(value) && isObject(base[key]) ? difference(value, base[key]) : value;
        }
    });
}

export { difference };
