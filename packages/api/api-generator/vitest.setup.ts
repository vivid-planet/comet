import "reflect-metadata";

import { vi } from "vitest";

vi.mock("@kubernetes/client-node", () => ({}));
