export const isValidISOString = (input: string): boolean => {
    // checks for valid ISO string according to ISO standard
    // https://stackoverflow.com/a/3143231
    return !!input.match(
        /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/,
    );
};
