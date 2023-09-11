// https://github.com/jest-community/eslint-plugin-jest/blob/main/docs/rules/no-conditional-expect.md#how-to-catch-a-thrown-error-for-testing-without-violating-this-rule

export class NoErrorThrownError extends Error {}

export const getError = async <TError>(call: () => unknown): Promise<TError> => {
    try {
        await call();

        throw new NoErrorThrownError();
    } catch (error: unknown) {
        return error as TError;
    }
};
