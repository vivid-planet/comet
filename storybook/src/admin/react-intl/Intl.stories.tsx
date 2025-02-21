import { FormattedDate, FormattedTime } from "react-intl";

export default {
    title: "@comet/admin/react-intl",
};

export const FormatLocalized = {
    render: () => {
        const date = new Date();
        return (
            <>
                <FormattedDate value={date} weekday="short" day="2-digit" month="2-digit" year="numeric" /> - <FormattedTime value={date} />
            </>
        );
    },

    name: "FormatLocalized",
};
