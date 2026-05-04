import { createContext } from "react";

import type { TipTapBlockStyle } from "./createTipTapRichTextBlock";

export const BlockStyleContext = createContext<TipTapBlockStyle[]>([]);
