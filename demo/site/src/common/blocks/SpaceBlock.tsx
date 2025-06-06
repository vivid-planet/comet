"use client";
import { type PropsWithData, withPreview } from "@comet/site-nextjs";
import { type SpaceBlockData } from "@src/blocks.generated";
import clsx from "clsx";

import styles from "./SpaceBlock.module.scss";

export const SpaceBlock = withPreview(
    ({ data: { spacing } }: PropsWithData<SpaceBlockData>) => {
        return <div className={clsx(styles.root, styles[spacing.toLowerCase()])} />;
    },
    { label: "Space" },
);
