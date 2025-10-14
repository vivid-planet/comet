import { type PropsWithData, withPreview } from "@comet/site-nextjs";
import { type FooterContentBlockData } from "@src/blocks.generated";
import { DamImageBlock } from "@src/common/blocks/DamImageBlock";
import { LinkBlock } from "@src/common/blocks/LinkBlock";
import { RichTextBlock } from "@src/common/blocks/RichTextBlock";
import { Typography } from "@src/common/components/Typography";
import { PageLayout } from "@src/layout/PageLayout";
import { createImageSizes } from "@src/util/createImageSizes";

import styles from "./FooterContentBlock.module.scss";

export const FooterContentBlock = withPreview(
    ({ data: { text, image, linkList, copyrightNotice } }: PropsWithData<FooterContentBlockData>) => {
        return (
            // ID is used for skip link
            <footer className={styles.root} id="footer">
                <PageLayout grid>
                    <div className={styles.pageLayoutContent}>
                        <div className={styles.topContainer}>
                            <div className={styles.imageWrapper}>
                                <DamImageBlock
                                    data={image}
                                    aspectRatio="inherit"
                                    style={{ objectFit: "contain" }}
                                    sizes={createImageSizes({ default: "20vw" })}
                                />
                            </div>
                            <div className={styles.richTextWrapper}>
                                <RichTextBlock data={text} disableLastBottomSpacing />
                            </div>
                        </div>
                        <hr className={styles.horizontalLine} />
                        <div className={styles.linkCopyrightWrapper}>
                            {linkList.blocks.length > 0 && (
                                <nav>
                                    <ul className={styles.linksWrapper}>
                                        {linkList.blocks.map((block) => (
                                            <li key={block.key}>
                                                <Typography as={LinkBlock} data={block.props.link} variant="p200" className={styles.linkText}>
                                                    {block.props.text}
                                                </Typography>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            )}
                            {copyrightNotice && (
                                <Typography variant="p200" className={styles.copyrightNotice}>
                                    {copyrightNotice}
                                </Typography>
                            )}
                        </div>
                    </div>
                </PageLayout>
            </footer>
        );
    },
    { label: "Footer" },
);
