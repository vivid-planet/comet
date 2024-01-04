import { ExtractBlockInputFactoryProps } from "@comet/blocks-api";
import { AnchorBlock } from "@comet/cms-api";
import { Injectable } from "@nestjs/common";
import { random } from "faker";

@Injectable()
export class AnchorBlockFixtureService {
    async generateBlockInput(): Promise<ExtractBlockInputFactoryProps<typeof AnchorBlock>> {
        return {
            name: random.word(),
        };
    }
}
