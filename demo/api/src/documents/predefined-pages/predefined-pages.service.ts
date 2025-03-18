import { Injectable } from "@nestjs/common";
import { PageTreeNodeScope } from "@src/page-tree/dto/page-tree-node-scope";

import { PredefinedPageType } from "./entities/predefined-page.entity";

@Injectable()
export class PredefinedPagesService {
    async getPredefinedPagePath({ scope, type }: { scope: PageTreeNodeScope; type: PredefinedPageType }): Promise<string | undefined> {
        return `/${scope}/${type.toLowerCase()}`;
    }
}
