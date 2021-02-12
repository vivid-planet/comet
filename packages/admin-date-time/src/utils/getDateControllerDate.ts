import * as moment from "moment";

export const getDateControllerText = (date: Date | null | undefined): moment.Moment | null => {
    if (date && moment(date).isValid()) {
        return moment(date);
    }

    return null;
};
