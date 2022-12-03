import { Result, ScriptedChatStateConfig, Step } from './types';
export declare class ScriptedChatState {
    currentStep: Step;
    script: Step[];
    results: Result[];
    config: ScriptedChatStateConfig;
    constructor(config: ScriptedChatStateConfig);
    getStep(id: string): Step;
    getNextStep(): Step;
    protected setStep(id: string): Step;
    replaceMessageValuesVariables(message: string): string;
    protected goToNextStep: (currentStepValues: any[]) => Promise<void>;
    reset(): void;
}
