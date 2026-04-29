import { DamVideoBlock, type PropsWithData, withPreview } from "@comet/site-nextjs";
import type { MediaDownloadBlockData } from "@src/blocks.generated";
import { DamImageBlock } from "@src/common/blocks/DamImageBlock";
import { PlayPauseButton } from "@src/common/helpers/PlayPauseButton";
import { PageLayout } from "@src/layout/PageLayout";
import { FormattedMessage } from "react-intl";

import styles from "./MediaDownloadBlock.module.scss";

type MediaDownloadBlockProps = PropsWithData<MediaDownloadBlockData>;

export const MediaDownloadBlock = withPreview(
    ({ data }: MediaDownloadBlockProps) => {
        const images = data.images.blocks.filter((block) => block.visible);
        const videos = data.videos.blocks.filter((block) => block.visible);

        if (images.length === 0 && videos.length === 0) {
            return null;
        }

        return (
            <div className={styles.root}>
                {images.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.heading}>
                            <FormattedMessage id="mediaDownloadBlock.images" defaultMessage="Images" />
                        </h2>
                        <ul className={styles.list}>
                            {images.map((block) => (
                                <li key={block.key} className={styles.item}>
                                    <DamImageBlock data={block.props} aspectRatio="3x2" sizes="(min-width: 768px) 33vw, 100vw" />
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
                {videos.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.heading}>
                            <FormattedMessage id="mediaDownloadBlock.videos" defaultMessage="Videos" />
                        </h2>
                        <ul className={styles.list}>
                            {videos.map((block) => (
                                <li key={block.key} className={styles.item}>
                                    <DamVideoBlock
                                        data={block.props}
                                        previewImageSizes="(min-width: 768px) 50vw, 100vw"
                                        aspectRatio="16x9"
                                        playPauseButton={PlayPauseButton}
                                    />
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>
        );
    },
    { label: "MediaDownload" },
);

export const PageContentMediaDownloadBlock = (props: MediaDownloadBlockProps) => (
    <PageLayout grid>
        <div className={styles.pageLayoutContent}>
            <MediaDownloadBlock {...props} />
        </div>
    </PageLayout>
);
