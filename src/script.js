var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ScriptState_instances, _ScriptState_replaceMessageValuesVariables;
export class ScriptState {
    constructor(config) {
        _ScriptState_instances.add(this);
        this.goToNextStep = (values) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            const result = {
                step: this.currentStep.id,
                values,
            };
            const nextStep = this.getNextStep();
            let validation = true;
            if (this.currentStep.beforeStepChange || this.config.beforeStepChange) {
                const beforeStepChangeEvent = {
                    result,
                    currentStep: this.currentStep,
                    nextStep,
                    results: this.results,
                };
                const hook = this.currentStep.beforeStepChange || this.config.beforeStepChange;
                validation = yield hook(beforeStepChangeEvent);
            }
            if (!validation || !values.length)
                return;
            this.results.push(result);
            (_b = (_a = this.config).onNewUserMessage) === null || _b === void 0 ? void 0 : _b.call(_a, values);
            const currentAfterStepChange = this.currentStep.afterStepChange;
            this.setStep(this.currentStep.next);
            const message = __classPrivateFieldGet(this, _ScriptState_instances, "m", _ScriptState_replaceMessageValuesVariables).call(this, nextStep.message);
            (_d = (_c = this.config).onNewOwnerMessage) === null || _d === void 0 ? void 0 : _d.call(_c, message);
            const isEndStep = nextStep.id === 'end';
            if (isEndStep) {
                // remove all options inputs and button
                (_f = (_e = this.config).onEnd) === null || _f === void 0 ? void 0 : _f.call(_e);
            }
            else {
                (_h = (_g = this.config).onContinue) === null || _h === void 0 ? void 0 : _h.call(_g, nextStep);
            }
            const afterStepChangeEvent = {
                result,
                results: this.results,
                currentStep: nextStep,
                nextStep: isEndStep ? null : this.getStep(nextStep.next),
            };
            yield ((_k = (_j = this.config).afterStepChange) === null || _k === void 0 ? void 0 : _k.call(_j, afterStepChangeEvent));
            yield (currentAfterStepChange === null || currentAfterStepChange === void 0 ? void 0 : currentAfterStepChange(afterStepChangeEvent));
        });
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
}
_ScriptState_instances = new WeakSet(), _ScriptState_replaceMessageValuesVariables = function _ScriptState_replaceMessageValuesVariables(message) {
    let _message = message;
    // Next implementation: {{start.2}} for multiple choice variables
    this.results.forEach((result) => {
        const regex = new RegExp(`\\{\\{${result.step}\\}\\}`, 'g');
        _message = _message.replace(regex, result.values.join(', '));
    });
    return _message;
};
