export const BUILDS_MODULE_OPTIONS = "builds-module-options";
export const BUILDS_CONFIG = "builds-config";

/** Label which identifies the CronJob that checks if a build is needed */
export const BUILD_CHECKER_LABEL = "comet-dxp.com/build-checker";

/** Annotation for the build Job: defines who triggered the build (CronJob, Manual, ChangesDetected) */
export const TRIGGER_ANNOTATION = "comet-dxp.com/trigger";

/** Label which identifies a build job */
export const BUILDER_LABEL = "comet-dxp.com/builder";

/** Annotation that includes the content scope used for the CronJob or Job */
export const CONTENT_SCOPE_ANNOTATION = "comet-dxp.com/content-scope";
