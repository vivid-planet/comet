export const BUILDS_MODULE_OPTIONS = "builds-module-options";
export const BUILDS_CONFIG = "builds-config";

/** Label which identifies the CronJob that checks if a build is needed */
export const BUILD_CHECKER_LABEL = "comet-dxp.com/build-checker";

/** Annotation for the build Job: defines who triggered the build (CronJob, Manual, ChangesDetected) */
export const TRIGGER_ANNOTATION = "comet-dxp.com/trigger";

/** Label which identifies a build job */
export const BUILDER_LABEL = "comet-dxp.com/builder";
/** Label which specifies the instance a build is assigned to (Helm-Release) */
export const INSTANCE_LABEL = "comet-dxp.com/instance";
/**
 * Label which specifies the CronJob for a Job
 * k8s ownerReference is not set, if job is not created by CronJob Controller
 * */
export const PARENT_CRON_JOB_LABEL = "comet-dxp.com/parent-cron-job";
