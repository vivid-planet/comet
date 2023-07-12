import { ChevronDown, ChevronUp } from "@comet/admin-icons";
import BrowserOnly from "@docusaurus/BrowserOnly";
import { usePrismTheme } from "@docusaurus/theme-common";
import type { ThemeConfig } from "@docusaurus/theme-live-codeblock";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useIsBrowser from "@docusaurus/useIsBrowser";
import { Button } from "@mui/material";
import type { Props } from "@theme/Playground";
import clsx from "clsx";
import React from "react";
import { LiveEditor, LiveError, LivePreview, LiveProvider } from "react-live";

import styles from "./styles.module.css";

function Header({ children }: { children: React.ReactNode }) {
    return <div className={clsx(styles.playgroundHeader)}>{children}</div>;
}

function LivePreviewLoader() {
    return <div>Loading...</div>;
}

function ResultWithHeader() {
    return (
        <>
            {/* https://github.com/facebook/docusaurus/issues/5747 */}
            <div className={styles.playgroundPreview}>
                <BrowserOnly fallback={<LivePreviewLoader />}>
                    {() => (
                        <>
                            <LivePreview />
                            <LiveError />
                        </>
                    )}
                </BrowserOnly>
            </div>
        </>
    );
}

function ThemedLiveEditor({ isOpen = false }) {
    const isBrowser = useIsBrowser();
    return (
        <LiveEditor
            // We force remount the editor on hydration,
            // otherwise dark prism theme is not applied
            key={String(isBrowser)}
            style={{ display: isOpen ? "block" : "none" }}
            className={styles.playgroundEditor}
        />
    );
}

function EditorWithHeader() {
    const [isEditorOpen, setIsEditorOpen] = React.useState(false);

    return (
        <>
            <Header>
                Code
                <Button
                    endIcon={isEditorOpen ? <ChevronUp /> : <ChevronDown />}
                    onClick={() => {
                        setIsEditorOpen((isOpen) => !isOpen);
                    }}
                >
                    {isEditorOpen ? "Close" : "Open"}
                </Button>
            </Header>
            <ThemedLiveEditor isOpen={isEditorOpen} />
        </>
    );
}

export default function Playground({ children, transformCode, ...props }: Props): JSX.Element {
    const {
        siteConfig: { themeConfig },
    } = useDocusaurusContext();
    const {
        liveCodeBlock: { playgroundPosition },
    } = themeConfig as ThemeConfig;
    const prismTheme = usePrismTheme();

    const noInline = props.metastring?.includes("noInline") ?? false;

    return (
        <div className={styles.playgroundContainer}>
            {/* @ts-expect-error: type incompatibility with refs */}
            <LiveProvider
                code={children.replace(/\n$/, "")}
                noInline={noInline}
                transformCode={transformCode ?? ((code) => `${code};`)}
                theme={prismTheme}
                {...props}
            >
                {playgroundPosition === "top" ? (
                    <>
                        <ResultWithHeader />
                        <EditorWithHeader />
                    </>
                ) : (
                    <>
                        <EditorWithHeader />
                        <ResultWithHeader />
                    </>
                )}
            </LiveProvider>
        </div>
    );
}
