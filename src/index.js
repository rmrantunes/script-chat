export class ScriptChat {
    // values: Values
    constructor(config) {
        this.handleNextStep = () => {
            var _a;
            const value = (_a = this.textFieldElement) === null || _a === void 0 ? void 0 : _a.value;
            console.log(this.textFieldElement);
            if (!value)
                return;
            this.renderUserMessage(value);
            // this.values[this.currentStep.id] = [value]
            const nextStep = this.setStep(this.currentStep.next);
            this.renderOwnerMessage(nextStep.message);
            if (nextStep.id === 'end') {
                // remove all options inputs and button
                this.hideTextField();
            }
        };
        this.containter = document.querySelector('#script-chat-container');
        this.stepsContainter = document.querySelector('#script-chat-messages-container');
        this.textFieldElement = document.querySelector('#script-chat-textfield');
        this.nextStepButtonElement = document.querySelector('#script-chat-next-step-button');
        this.script = config.script;
        this.currentStep = this.getStep('start') || this.script[0];
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
        return step;
    }
    renderOwnerMessage(message) {
        var _a;
        const messageElement = document.createElement('span');
        messageElement.classList.add('script-chat-owner-message');
        messageElement.innerText = message;
        (_a = this.stepsContainter) === null || _a === void 0 ? void 0 : _a.appendChild(messageElement);
    }
    renderUserMessage(message) {
        var _a;
        const messageElement = document.createElement('span');
        messageElement.classList.add('script-chat-user-message');
        messageElement.innerText = message;
        (_a = this.stepsContainter) === null || _a === void 0 ? void 0 : _a.appendChild(messageElement);
    }
    showTextField(type = 'text') {
        var _a, _b;
        (_a = this.textFieldElement) === null || _a === void 0 ? void 0 : _a.setAttribute('type', type);
        (_b = this.textFieldElement) === null || _b === void 0 ? void 0 : _b.setAttribute('aria-hidden', 'false');
    }
    hideTextField() {
        var _a;
        (_a = this.textFieldElement) === null || _a === void 0 ? void 0 : _a.setAttribute('aria-hidden', 'true');
    }
    init() {
        var _a;
        this.renderOwnerMessage(this.currentStep.message);
        const currentType = this.currentStep.input;
        if (currentType === 'email' || currentType === 'text') {
            this.showTextField(currentType);
        }
        (_a = this.nextStepButtonElement) === null || _a === void 0 ? void 0 : _a.addEventListener('click', this.handleNextStep);
    }
}
