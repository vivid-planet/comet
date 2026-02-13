"use client";

import { usePreview } from "@comet/site-nextjs";
import { useFadeGroup } from "@src/util/animations/FadeGroup";
import { useGlobalScrollSpeed } from "@src/util/animations/useGlobalScrollSpeed";
import { useWindowSize } from "@src/util/useWindowSize";
import clsx from "clsx";
import { type ReactElement, useEffect, useRef, useState } from "react";

import styles from "./FadeBoxInOnScroll.module.scss";

interface FadeBoxInOnScrollProps {
    direction?: "top" | "right" | "bottom" | "left" | undefined;
    children: ReactElement;
    offset?: number;
    delay?: number;
    fullHeight?: boolean;
    onChange?: (inView: boolean) => void;
    className?: string;
    innerClassName?: string;
}

export function FadeBoxInOnScroll({
    children,
    direction = undefined,
    offset = 200,
    delay = 0,
    fullHeight = false,
    onChange,
    className,
    innerClassName,
    ...props
}: FadeBoxInOnScrollProps) {
    const fadeGroup = useFadeGroup();
    const refScrollContainer = useRef<HTMLDivElement | null>(null);
    const [fadeIn, setFadeIn] = useState<boolean>(false);
    const { previewType } = usePreview();
    const windowSize = useWindowSize();
    const scrollSpeed = useGlobalScrollSpeed();

    const groupForceVisible = fadeGroup?.visible ?? false;
    const groupOnVisible = fadeGroup?.onVisible;

    // Dynamic delay and fade duration for speedup fade in on faster scrolling
    const dynamicDelay = scrollSpeed > 1 ? delay / (scrollSpeed / 2) : delay;
    const dynamicFadeDuration = scrollSpeed > 1 ? Math.min(500 / (scrollSpeed / 2), 200) : 500;

    useEffect(() => {
        const scrollContainer = refScrollContainer.current;
        if (!scrollContainer || previewType === "BlockPreview") return;

        // Dynamic offset for trigger fade in earlier on faster scrolling
        const dynamicOffsetScrollSpeed = scrollSpeed > 1 ? scrollSpeed * 100 : 0;
        // Dynamic offset page height for adjusting offset relative to page height
        const dynamicOffsetPageHeight = windowSize ? (windowSize?.height / 2.5) * -1 + offset : offset;
        const fadeInOffset = dynamicOffsetScrollSpeed + dynamicOffsetPageHeight;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setFadeIn(true);
                        onChange?.(entry.isIntersecting);
                        groupOnVisible?.();
                    }
                });
            },
            {
                rootMargin: `0px 0px ${direction === "bottom" ? fadeInOffset + 40 : direction === "top" ? fadeInOffset - 40 : fadeInOffset}px 0px`,
                threshold: 0,
            },
        );

        observer.observe(scrollContainer);

        return () => {
            if (scrollContainer) {
                observer.unobserve(scrollContainer);
            }
        };
    }, [offset, previewType, direction, windowSize, onChange, scrollSpeed, groupOnVisible]);

    // Set CSS variable for delay and duration
    const style = { "--fade-delay": `${dynamicDelay ?? 0}ms`, "--fade-duration": `${dynamicFadeDuration ?? 0}ms` } as React.CSSProperties;

    return (
        <div className={clsx(styles.overflowContainer, className)}>
            <div
                ref={refScrollContainer}
                onFocus={() => {
                    setFadeIn(true);
                    groupOnVisible?.();
                }}
                className={clsx(
                    styles.scrollContainer,
                    fullHeight && styles.fullHeight,
                    direction === "left" && styles.fromLeft,
                    direction === "right" && styles.fromRight,
                    direction === "top" && styles.fromTop,
                    direction === "bottom" && styles.fromBottom,
                    (previewType === "BlockPreview" || fadeIn || groupForceVisible) && styles.fadeIn,
                    innerClassName,
                )}
                style={style}
                {...props}
            >
                {children}
            </div>
        </div>
    );
}
