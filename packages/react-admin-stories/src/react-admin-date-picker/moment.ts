import * as moment from "moment";

export function setMomentLocale(locale = "de") {
    moment.locale("de");
    const localLocale = moment();
    return localLocale.locale(locale);
}
