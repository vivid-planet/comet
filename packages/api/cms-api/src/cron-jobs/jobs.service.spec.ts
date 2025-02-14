import { Test, type TestingModule } from "@nestjs/testing";

import { KubernetesModule } from "../kubernetes/kubernetes.module";
import { JobsService } from "./jobs.service";

jest.mock("@kubernetes/client-node", () => ({}));

describe("KubernetesJobsService", () => {
    let service: JobsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [KubernetesModule.register({ helmRelease: "test" })],
            providers: [JobsService],
        }).compile();

        service = module.get<JobsService>(JobsService);
    });

    it("should create job name with full date", () => {
        expect(service.createJobNameFromCronJobForManualRun("test")).toMatch(/^test-man-\d\d\d\d-\d\d-\d\d-\d\d-\d\d-\d\d$/);
    });

    it("should shorten job name if result would be longer than 63 chars", () => {
        expect(service.createJobNameFromCronJobForManualRun("test-a-really-long-kubernetes-cronjob-name").length).toBeLessThanOrEqual(63);
    });
});
