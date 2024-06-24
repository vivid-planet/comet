const PHONE_NUMBER_REGEX = /^\+?[0-9\s]+$/;

export const isPhoneNumber = (value: string): boolean => {
    return PHONE_NUMBER_REGEX.test(value);
};
