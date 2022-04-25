import * as React from "react";

import { Space } from "../../Space";
import { BlockInputApi, BlockState } from "../../types";
import { resolveNewState } from "../../utils";
import { YouTubeVideoBlock } from "../../YouTubeVideoBlock";
import { composeBlocks, ComposeBlocksApi } from "./composeBlocks";
import { createCompositeSetting } from "./createCompositeSetting";
import { createCompositeSettings } from "./createCompositeSettings";
import { AdminComponentPropsMap, CompositeBlocksConfig, DataMapState } from "./types";

describe("composeBlocks", () => {
    it("composes values of 2 BlockInterfaces", () => {
        const composedBlock = composeBlocks({
            space: Space,
            video: YouTubeVideoBlock,
        });

        const {
            block: { defaultValues, state2Output, input2State },
            block,
        } = composedBlock;

        const input: BlockInputApi<typeof block> = {
            space: {
                height: 50,
            },
            video: {
                aspectRatio: "16X9",
                youtubeIdentifier: "abc",
                autoplay: true,
                showControls: true,
            },
        };

        const state: BlockState<typeof block> = {
            space: {
                height: 50,
            },
            video: {
                aspectRatio: "16X9",
                youtubeIdentifier: "abc",
                autoplay: true,
                showControls: true,
            },
        };

        expect(defaultValues()).toStrictEqual({ space: Space.defaultValues(), video: YouTubeVideoBlock.defaultValues() });
        expect(input2State(input)).toStrictEqual({ space: Space.input2State(input.space), video: YouTubeVideoBlock.input2State(input.video) });
        expect(state2Output(state)).toStrictEqual({ space: Space.state2Output(state.space), video: YouTubeVideoBlock.state2Output(state.video) });

        // test update state methods

        const { propsMap, getTestState } = createTestStateStore(composedBlock, {
            space: {
                height: 10,
            },
            video: {
                aspectRatio: "16X9",
                youtubeIdentifier: "abc",
                autoplay: true,
                showControls: true,
            },
        });

        propsMap.space.updateState({ height: 30 });
        propsMap.video.updateState({ aspectRatio: "4X3", youtubeIdentifier: "def" });

        expect(getTestState()).toStrictEqual({ space: { height: 30 }, video: { aspectRatio: "4X3", youtubeIdentifier: "def" } });
    });

    it("composes values of 1 BlockInterface and 1 settings - flattened", () => {
        interface Settings {
            foo: string;
            baz?: number;
        }
        const composedBlock = composeBlocks({
            space1: Space,
            $settings: createCompositeSettings<Settings>({
                defaultValues: {
                    foo: "bar",
                    baz: undefined,
                },
                AdminComponent: () => <>not testing</>,
            }),
        });

        const {
            block: { defaultValues, state2Output, input2State },
            block,
        } = composedBlock;

        const input: BlockInputApi<typeof block> = {
            space1: {
                height: 50,
            },
            foo: "bar1",
            baz: 1,
        };

        const state: BlockState<typeof block> = {
            space1: {
                height: 50,
            },
            foo: "bar2",
        };

        expect(defaultValues()).toStrictEqual({ space1: Space.defaultValues(), foo: "bar", baz: undefined });
        expect(input2State(input)).toStrictEqual({ space1: Space.input2State(input.space1), foo: "bar1", baz: 1 });
        expect(state2Output(state)).toStrictEqual({ space1: Space.state2Output(state.space1), foo: "bar2" });

        // test update state methods

        const { propsMap, getTestState } = createTestStateStore(composedBlock, {
            space1: {
                height: 50,
            },
            foo: "1",
        });

        propsMap.$settings.updateState({ foo: "abc", baz: 1 });
        expect(getTestState()).toStrictEqual({ space1: { height: 50 }, foo: "abc", baz: 1 });

        propsMap.$settings.updateState({ foo: "def" });

        expect(getTestState()).toStrictEqual({ space1: { height: 50 }, foo: "def" });

        propsMap.space1.updateState({ height: 5000 });

        expect(getTestState()).toStrictEqual({ space1: { height: 5000 }, foo: "def" });
    });

    it("composes values of 2 BlockInterface and 1 scalar setting", () => {
        type Setting = string;
        const composedBlock = composeBlocks({
            space: Space,
            video: YouTubeVideoBlock,
            foo: createCompositeSetting<Setting>({
                defaultValue: "bar",
                AdminComponent: () => <>not testing</>,
            }),
        });

        const {
            block: { defaultValues, state2Output, input2State },
            block,
        } = composedBlock;

        const input: BlockInputApi<typeof block> = {
            space: {
                height: 50,
            },
            video: {
                aspectRatio: "16X9",
                youtubeIdentifier: "abc",
                autoplay: true,
                showControls: true,
            },
            foo: "bar1",
        };

        const state: BlockState<typeof block> = {
            space: {
                height: 50,
            },
            video: {
                aspectRatio: "16X9",
                youtubeIdentifier: "abc",
                autoplay: true,
                showControls: true,
            },
            foo: "bar2",
        };

        expect(defaultValues()).toStrictEqual({ space: Space.defaultValues(), video: YouTubeVideoBlock.defaultValues(), foo: "bar" });
        expect(input2State(input)).toStrictEqual({
            space: Space.input2State(input.space),
            video: YouTubeVideoBlock.input2State(input.video),
            foo: "bar1",
        });
        expect(state2Output(state)).toStrictEqual({
            space: Space.state2Output(state.space),
            video: YouTubeVideoBlock.state2Output(state.video),
            foo: "bar2",
        });

        // test update state methods

        const { propsMap, getTestState } = createTestStateStore(composedBlock, {
            space: {
                height: 10,
            },
            video: {
                aspectRatio: "16X9",
                youtubeIdentifier: "abc",
                autoplay: true,
                showControls: true,
            },
            foo: "bar2",
        });

        propsMap.space.updateState({ height: 30 });
        propsMap.video.updateState({ aspectRatio: "4X3", youtubeIdentifier: "def", autoplay: false, showControls: true });
        propsMap.foo.updateState("baz");

        expect(getTestState()).toStrictEqual({
            space: { height: 30 },
            video: { aspectRatio: "4X3", youtubeIdentifier: "def", autoplay: false, showControls: true },
            foo: "baz",
        });
    });

    it("composes values of 1 BlockInterface and 1 setting with value undefined", () => {
        type Setting = string | undefined;

        const composedBlock = composeBlocks({
            space1: Space,
            foo: createCompositeSetting<Setting>({
                defaultValue: undefined,
                AdminComponent: () => <>not testing</>,
            }),
        });

        const {
            block: { defaultValues, state2Output, input2State },
            block,
        } = composedBlock;

        const input: BlockInputApi<typeof block> = {
            space1: {
                height: 50,
            },
            foo: undefined,
        };

        delete input.foo; // make really undefined

        const state: BlockState<typeof block> = {
            space1: {
                height: 50,
            },
            foo: undefined,
        };

        delete state.foo; // make really undefined

        expect(defaultValues()).toStrictEqual({ space1: Space.defaultValues(), foo: undefined });
        expect(input2State(input)).toStrictEqual({ space1: Space.input2State(input.space1), foo: undefined });
        // expect(input2State(input)).toStrictEqual({ space1: Space.input2State(input.space1) }); // should this be expected instead?

        expect(state2Output(state)).toStrictEqual({ space1: Space.state2Output(state.space1), foo: undefined });
        // expect(state2Output(state)).toStrictEqual({ space1: Space.state2Output(state.space1) }); // should this be expected instead?

        // test update state methods

        const { propsMap, getTestState } = createTestStateStore(composedBlock, {
            space1: {
                height: 10,
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);

        expect(getTestState()).toStrictEqual({
            space1: { height: 10 },
        });

        propsMap.space1.updateState({ height: 30 });

        expect(getTestState()).toStrictEqual({
            space1: { height: 30 },
        });

        propsMap.foo.updateState(undefined);

        expect(getTestState()).toStrictEqual({
            space1: { height: 30 },
            foo: undefined,
        });

        propsMap.foo.updateState("bar");

        expect(getTestState()).toStrictEqual({
            space1: { height: 30 },
            foo: "bar",
        });
    });
});

// provides a store where we can update values with our updateState-methods
function createTestStateStore<C extends CompositeBlocksConfig>(
    { api }: ComposeBlocksApi<C>,
    initialState: DataMapState<C>,
): {
    propsMap: AdminComponentPropsMap<C>;
    getTestState: () => DataMapState<C>;
} {
    let state: DataMapState<C> = initialState;
    let prevState: DataMapState<C> = initialState;

    const propsMap = api.adminComponentProps({
        state: prevState,
        updateState: (setStateAction) => {
            state = resolveNewState({
                prevState,
                setStateAction,
            });
            prevState = Object.assign({}, state); // copy
        },
    });

    return {
        propsMap,
        getTestState: () => state,
    };
}
