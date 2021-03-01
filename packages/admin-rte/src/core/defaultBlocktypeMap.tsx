import { Typography } from "@material-ui/core";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import FormatListNumberedIcon from "@material-ui/icons/FormatListNumbered";
import * as React from "react";
import { defineMessage, FormattedMessage } from "react-intl";

import { IBlocktypeMap } from "./types";

const headerMessage = defineMessage({ id: "cometAdminCore.rte.controls.blockType.heading", defaultMessage: "Heading {level}" });

const defaultBlocktypeMap: IBlocktypeMap = {
    // "unstyled" is special: only the value for renderConfig is considered,
    // other values are ignored
    unstyled: {
        //info:  https://draftjs.org/docs/advanced-topics-custom-block-render-map/#configuring-block-render-map
        renderConfig: {
            element: Typography,
            aliasedElements: ["p"],
        },
    },
    "header-one": {
        supportedBy: "header-one",
        label: <FormattedMessage {...headerMessage} values={{ level: 1 }} />,
        group: "dropdown",
        renderConfig: {
            element: (p) => <Typography variant="h1" {...p} />,
            aliasedElements: ["h1"], // important for matching tags when "word-content" is pasted into rte
        },
    },
    "header-two": {
        supportedBy: "header-two",
        label: <FormattedMessage {...headerMessage} values={{ level: 2 }} />,
        group: "dropdown",
        renderConfig: {
            element: (p) => <Typography variant="h2" {...p} />,
            aliasedElements: ["h2"],
        },
    },
    "header-three": {
        supportedBy: "header-three",
        label: <FormattedMessage {...headerMessage} values={{ level: 3 }} />,
        group: "dropdown",
        renderConfig: {
            element: (p) => <Typography variant="h3" {...p} />,
            aliasedElements: ["h3"],
        },
    },
    "header-four": {
        supportedBy: "header-four",
        label: <FormattedMessage {...headerMessage} values={{ level: 4 }} />,
        group: "dropdown",
        renderConfig: {
            element: (p) => <Typography variant="h4" {...p} />,
            aliasedElements: ["h4"],
        },
    },
    "header-five": {
        supportedBy: "header-five",
        label: <FormattedMessage {...headerMessage} values={{ level: 5 }} />,
        group: "dropdown",
        renderConfig: {
            element: (p) => <Typography variant="h5" {...p} />,
            aliasedElements: ["h5"],
        },
    },
    "header-six": {
        supportedBy: "header-six",
        label: <FormattedMessage {...headerMessage} values={{ level: 6 }} />,
        group: "dropdown",
        renderConfig: {
            element: (p) => <Typography variant="h6" {...p} />,
            aliasedElements: ["h6"],
        },
    },
    blockquote: {
        supportedBy: "blockquote",
        label: <FormattedMessage id="cometAdminCore.rte.controls.blockType.blockquote" defaultMessage="Blockquote" />,
        renderConfig: {
            // @TODO: A better default styling is needed
            element: (p) => <Typography variant="overline" {...p} />, //@TODO: what should be default MUI-element here?
            aliasedElements: ["blockquote"],
        },
    },
    "unordered-list-item": {
        supportedBy: "unordered-list",
        group: "button",
        label: <FormattedMessage id="cometAdminCore.rte.controls.blockType.unorderedList" defaultMessage="Bulletpoints" />,
        icon: FormatListBulletedIcon,
        renderConfig: {
            wrapper: <Typography component="ul" style={{ padding: 0 }} />,
            element: "li", // Do not change this to a react component (<Typography {...p}/>) unless you implement the css for nesting lists yourself!
            // This css is used by default and it handles the nesting: https://github.com/facebook/draft-js/blob/master/src/component/utils/DraftStyleDefault.css#L152
            // But for this css to be applied "element" needs to be an (undecorated) li-element
        },
    },
    "ordered-list-item": {
        supportedBy: "ordered-list",
        group: "button",
        label: <FormattedMessage id="cometAdminCore.rte.controls.blockType.orderedList" defaultMessage="Numbering" />,
        icon: FormatListNumberedIcon,
        renderConfig: {
            wrapper: <Typography component="ol" style={{ padding: 0 }} />,
            element: "li", // same thing that applies to unordered-list-item applies here too!
        },
    },
};

export function mergeBlocktypeMaps(...args: IBlocktypeMap[]) {
    return args.reduce((a, b) => {
        const remaining = { ...b }; // copy or bad things happen
        const newEl: IBlocktypeMap = {};
        Object.entries(a).forEach(([key, c]) => {
            if (remaining[key]) {
                // merge 2nd level
                newEl[key] = { ...c, ...remaining[key] };
                delete remaining[key];
            } else {
                newEl[key] = { ...c }; // only one level
            }
        });
        // merge in remaining
        Object.entries(remaining).forEach(([key, c]) => {
            newEl[key] = { ...c };
        });
        return newEl;
    }); // merge 2 levels nested
}

export default defaultBlocktypeMap;
