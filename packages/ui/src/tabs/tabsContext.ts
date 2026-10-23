"use client";

import { createContext } from "react";

import type { TabsOrientation } from "./Tabs";

/**
 * The orientation of the enclosing `Tabs`, so its parts can resolve their owner state.
 */
export const TabsOrientationContext = createContext<TabsOrientation>("horizontal");
