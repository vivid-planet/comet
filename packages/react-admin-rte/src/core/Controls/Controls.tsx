import * as React from "react";
import { IControlProps } from "../types";
import BlockTypesControls from "./BlockTypesControls";
import HistoryControls from "./HistoryContols";
import InlineStyleTypeControls from "./InlineStyleTypeControls";
import LinkControls from "./LinkControls";
import ListsControls from "./ListsControls";
import ListsIndentControls from "./ListsIndentControls";
import Toolbar from "./Toolbar";

export default function Controls(p: IControlProps) {
    const {
        options: { splitToolbar },
    } = p;
    return splitToolbar ? (
        <>
            <Toolbar {...p}>{[HistoryControls, BlockTypesControls, InlineStyleTypeControls]}</Toolbar>
            <Toolbar {...p}>{[ListsControls, ListsIndentControls, LinkControls]}</Toolbar>
        </>
    ) : (
        <Toolbar {...p}>{[HistoryControls, BlockTypesControls, InlineStyleTypeControls, ListsControls, ListsIndentControls, LinkControls]}</Toolbar>
    );
}
