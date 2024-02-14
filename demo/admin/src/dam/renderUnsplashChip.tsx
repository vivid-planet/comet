import { DamRow } from "@comet/cms-admin";
import { Chip } from "@mui/material";
import React from "react";
import { FormattedMessage } from "react-intl";

import UnsplashIcon from "./UnsplashIcon";

function renderUnsplashChip(row: DamRow) {
    return row.__typename === "DamFile" && row.importSourceType === "unsplash" ? (
        <Chip size="small" icon={<UnsplashIcon />} label={<FormattedMessage id="dam.unsplashImport.chip.label" defaultMessage="Unsplash" />} />
    ) : null;
}

export { renderUnsplashChip };
