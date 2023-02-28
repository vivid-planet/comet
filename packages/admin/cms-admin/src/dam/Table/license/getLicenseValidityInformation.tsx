import { add, compareAsc, getUnixTime } from "date-fns";

const currentDate = new Date();
const thirtyDaysInSeconds = 60 * 60 * 24 * 30;

interface GetLicenseValidityInformationParams {
    durationFrom?: Date;
    durationTo?: Date;
}

interface LicenseValidityInformation {
    isNotValidYet: boolean;
    expiresSoon: boolean;
    isExpired: boolean;
    isValid: boolean;
    startDate?: Date;
    expirationDate?: Date;
}

export const getLicenseValidityInformation = ({ durationFrom, durationTo }: GetLicenseValidityInformationParams): LicenseValidityInformation => {
    const startDate = durationFrom;
    // if durationTo = '2023-02-27T00:00:00.000Z' then the license is still valid on 27.03.2023
    // and expires at '2023-02-28T00:00:00.000Z'
    const expirationDate = durationTo
        ? add(durationTo, {
              days: 1,
          })
        : undefined;

    const validityInformation: LicenseValidityInformation = {
        isNotValidYet: false,
        expiresSoon: false,
        isExpired: false,
        isValid: true,
        startDate,
        expirationDate,
    };

    if (startDate && compareAsc(currentDate, startDate) === -1) {
        validityInformation.isNotValidYet = true;
    }

    const differenceBetweenExpirationDateAndNow = expirationDate ? getUnixTime(expirationDate) - getUnixTime(currentDate) : null;
    if (
        differenceBetweenExpirationDateAndNow !== null &&
        differenceBetweenExpirationDateAndNow > 0 &&
        differenceBetweenExpirationDateAndNow <= thirtyDaysInSeconds
    ) {
        validityInformation.expiresSoon = true;
    }

    if (expirationDate && compareAsc(currentDate, expirationDate) === 1) {
        validityInformation.isExpired = true;
    }

    if (validityInformation.isNotValidYet || validityInformation.isExpired) {
        validityInformation.isValid = false;
    }

    return validityInformation;
};
