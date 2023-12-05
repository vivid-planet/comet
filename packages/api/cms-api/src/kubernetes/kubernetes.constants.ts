export const KUBERNETES_CONFIG = "kubernetes-config";

/** Label which specifies the instance a build is assigned to (Helm-Release) */
export const INSTANCE_LABEL = "comet-dxp.com/instance";
/**
 * Label which specifies the CronJob for a Job
 * k8s ownerReference is not set, if job is not created by CronJob Controller
 * */
export const PARENT_CRON_JOB_LABEL = "comet-dxp.com/parent-cron-job";

/** Annotation for a cron job or job to provide a human readable name */
export const LABEL_ANNOTATION = "comet-dxp.com/label";
