var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ScriptChat_instances, _ScriptChat_isTextField, _ScriptChat_replaceMessageValuesVariables;
export class ScriptChat {
    constructor(config) {
        _ScriptChat_instances.add(this);
        this.getUserValues = () => {
            var _a;
            if (__classPrivateFieldGet(this, _ScriptChat_instances, "m", _ScriptChat_isTextField).call(this)) {
                return [(_a = this.textFieldElement) === null || _a === void 0 ? void 0 : _a.value];
            }
            return [];
        };
        this.handleNextStep = () => {
            var _a, _b, _c, _d;
            const values = this.getUserValues();
            const result = {
                step: this.currentStep.id,
                values,
            };
            const nextStep = this.getNextStep();
            let validation = true;
            if (this.config.beforeStepChange) {
                validation = (_b = (_a = this.config).beforeStepChange) === null || _b === void 0 ? void 0 : _b.call(_a, {
                    result,
                    currentStep: this.currentStep,
                    nextStep,
                    results: this.results,
                });
            }
            if (!validation || !values.length)
                return;
            this.results.push(result);
            this.renderUserMessage(values.join(', '));
            this.setStep(this.currentStep.next);
            const message = __classPrivateFieldGet(this, _ScriptChat_instances, "m", _ScriptChat_replaceMessageValuesVariables).call(this, nextStep.message);
            this.renderOwnerMessage(message);
            const isEndStep = nextStep.id === 'end';
            if (isEndStep) {
                // remove all options inputs and button
                this.hideTextField();
            }
            (_d = (_c = this.config).afterStepChange) === null || _d === void 0 ? void 0 : _d.call(_c, {
                result,
                results: this.results,
                currentStep: nextStep,
                nextStep: isEndStep ? null : this.getStep(nextStep.next),
            });
        };
        this.containter = document.querySelector('#script-chat-container');
        this.stepsContainter = document.querySelector('#script-chat-messages-container');
        this.textFieldElement = document.querySelector('#script-chat-textfield');
        this.nextStepButtonElement = document.querySelector('#script-chat-next-step-button');
        this.script = config.script;
        this.currentStep = this.getStep('start') || this.script[0];
        this.results = [];
        this.config = config;
    }
    getStep(id) {
        const step = this.script.find((step) => step.id === id);
        if (!step) {
            throw new Error(`Script does not contain step '${id}'`);
        }
        return step;
    }
    getNextStep() {
        return this.getStep(this.currentStep.next);
    }
    setStep(id) {
        const step = this.getStep(id);
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
        var _a, _b, _c;
        (_a = this.textFieldElement) === null || _a === void 0 ? void 0 : _a.setAttribute('type', type);
        (_b = this.textFieldElement) === null || _b === void 0 ? void 0 : _b.setAttribute('aria-hidden', 'false');
        (_c = this.textFieldElement) === null || _c === void 0 ? void 0 : _c.removeAttribute('disabled');
    }
    hideTextField() {
        var _a, _b;
        (_a = this.textFieldElement) === null || _a === void 0 ? void 0 : _a.setAttribute('aria-hidden', 'true');
        (_b = this.textFieldElement) === null || _b === void 0 ? void 0 : _b.setAttribute('disabled', 'true');
    }
    init() {
        var _a;
        const message = __classPrivateFieldGet(this, _ScriptChat_instances, "m", _ScriptChat_replaceMessageValuesVariables).call(this, this.currentStep.message);
        this.renderOwnerMessage(message);
        const currentType = this.currentStep.input;
        if (__classPrivateFieldGet(this, _ScriptChat_instances, "m", _ScriptChat_isTextField).call(this)) {
            this.showTextField(currentType);
        }
        (_a = this.nextStepButtonElement) === null || _a === void 0 ? void 0 : _a.addEventListener('click', this.handleNextStep);
    }
}
_ScriptChat_instances = new WeakSet(), _ScriptChat_isTextField = function _ScriptChat_isTextField() {
    return ['text', 'email', 'number'].includes(this.currentStep.input);
}, _ScriptChat_replaceMessageValuesVariables = function _ScriptChat_replaceMessageValuesVariables(message) {
    let _message = message;
    this.results.forEach((result) => {
        const regex = new RegExp(`\\{\\{${result.step}\\}\\}`, 'g');
        _message = _message.replace(regex, result.values.join(', '));
    });
    return _message;
};
