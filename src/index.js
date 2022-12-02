export class ScriptChat {
    // values: Value[]
    constructor(config) {
        this.stepsContainter = document.querySelector('#script-chat-steps-container');
        this.script = config.script;
        this.currentStep = this.getStep('start') || this.script[0];
        console.log(this);
    }
    getStep(id) {
        return this.script.find((step) => step.id === id);
    }
    getNextStep() {
        return this.getStep(this.currentStep.next);
    }
    setStep(id) {
        const step = this.getStep(id);
        if (!step) {
            throw new Error(`Script does not contain step '${id}'`);
        }
        this.currentStep = step;
    }
    handleNextStep() { }
}
