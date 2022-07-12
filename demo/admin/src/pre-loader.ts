const scripts = document.getElementsByTagName("script");
[].every.call(scripts, (script: HTMLScriptElement) => {
    const m = script.src.match(/^(.*)?\/build\/comet-demo-admin/);
    if (m) {
        __webpack_public_path__ = m[1] + __webpack_public_path__;
        return false;
    }
    return true;
});
