var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ScriptChat_instances, _ScriptChat_isTextField;
export class ScriptChat {
    constructor(config) {
        _ScriptChat_instances.add(this);
        this.getUserValue = () => {
            var _a;
            if (__classPrivateFieldGet(this, _ScriptChat_instances, "m", _ScriptChat_isTextField).call(this)) {
                return (_a = this.textFieldElement) === null || _a === void 0 ? void 0 : _a.value;
            }
        };
        this.handleNextStep = () => {
            const value = this.getUserValue();
            console.log(value);
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
        this.values = [];
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
        if (__classPrivateFieldGet(this, _ScriptChat_instances, "m", _ScriptChat_isTextField).call(this)) {
            this.showTextField(currentType);
        }
        (_a = this.nextStepButtonElement) === null || _a === void 0 ? void 0 : _a.addEventListener('click', this.handleNextStep);
    }
}
_ScriptChat_instances = new WeakSet(), _ScriptChat_isTextField = function _ScriptChat_isTextField() {
    return ['text', 'email', 'number'].includes(this.currentStep.input);
};
