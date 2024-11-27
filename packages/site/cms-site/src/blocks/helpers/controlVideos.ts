import { RefObject } from "react";

export const playDamVideo = (videoRef: RefObject<HTMLVideoElement>) => {
    if (videoRef.current) {
        videoRef.current.play();
    }
};

export const pauseDamVideo = (videoRef: RefObject<HTMLVideoElement>) => {
    if (videoRef.current) {
        videoRef.current.pause();
    }
};

export const pauseYoutubeVideo = () => {
    const iframe = document.getElementsByTagName("iframe")[0];
    if (iframe?.contentWindow) {
        iframe.contentWindow.postMessage(`{"event":"command","func":"pauseVideo","args":""}`, "*");
    }
};

export const playYoutubeVideo = () => {
    const iframe = document.getElementsByTagName("iframe")[0];
    if (iframe?.contentWindow) {
        iframe.contentWindow.postMessage(`{"event":"command","func":"playVideo","args":""}`, "*");
    }
};

export const pauseVimeoVideo = () => {
    const iframe = document.getElementsByTagName("iframe")[0];
    if (iframe?.contentWindow) {
        iframe.contentWindow.postMessage(JSON.stringify({ method: "pause" }), "https://player.vimeo.com");
    }
};

export const playVimeoVideo = () => {
    const iframe = document.getElementsByTagName("iframe")[0];
    if (iframe?.contentWindow) {
        iframe.contentWindow.postMessage(JSON.stringify({ method: "play" }), "https://player.vimeo.com");
    }
};
