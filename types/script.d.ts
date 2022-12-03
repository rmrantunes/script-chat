import { ScriptedChatState } from './state.js';
import { ScriptedChatJSConfig } from './types';
export declare class ScriptedChatJS extends ScriptedChatState {
    #private;
    containter: Element | Document;
    stepsContainter: Element | null;
    textFieldElement: HTMLInputElement | null;
    nextStepButtonElement: Element | null;
    controlElement: HTMLDivElement | null;
    constructor(config: ScriptedChatJSConfig);
    init(): void;
    cleanup(): void;
}
