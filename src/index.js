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
var _ScriptedChatJS_instances, _ScriptedChatJS_renderOwnerMessage, _ScriptedChatJS_renderUserMessage, _ScriptedChatJS_hideControl, _ScriptedChatJS_showControl, _ScriptedChatJS_showTextField, _ScriptedChatJS_hideTextField, _ScriptedChatJS_isTextField, _ScriptedChatJS_getUserValues, _ScriptedChatJS_handleNextStep;
import { ScriptedChatState } from './script.js';
export class ScriptedChatJS extends ScriptedChatState {
    constructor(config) {
        super(Object.assign(Object.assign({}, config), { onNewOwnerMessage: (message) => {
                __classPrivateFieldGet(this, _ScriptedChatJS_instances, "m", _ScriptedChatJS_renderOwnerMessage).call(this, message);
            }, onNewUserMessage: (values) => {
                __classPrivateFieldGet(this, _ScriptedChatJS_instances, "m", _ScriptedChatJS_renderUserMessage).call(this, values.join(', '));
            }, onEnd: () => {
                __classPrivateFieldGet(this, _ScriptedChatJS_instances, "m", _ScriptedChatJS_hideControl).call(this);
                __classPrivateFieldGet(this, _ScriptedChatJS_instances, "m", _ScriptedChatJS_hideTextField).call(this);
            }, onContinue: (nextStep) => {
                __classPrivateFieldGet(this, _ScriptedChatJS_instances, "m", _ScriptedChatJS_isTextField).call(this, nextStep.input) && __classPrivateFieldGet(this, _ScriptedChatJS_instances, "m", _ScriptedChatJS_showTextField).call(this, nextStep.input);
            } }));
        _ScriptedChatJS_instances.add(this);
        _ScriptedChatJS_getUserValues.set(this, () => {
            var _a;
            if (__classPrivateFieldGet(this, _ScriptedChatJS_instances, "m", _ScriptedChatJS_isTextField).call(this)) {
                return [(_a = this.textFieldElement) === null || _a === void 0 ? void 0 : _a.value];
            }
            return [];
        });
        _ScriptedChatJS_handleNextStep.set(this, () => __awaiter(this, void 0, void 0, function* () {
            const values = __classPrivateFieldGet(this, _ScriptedChatJS_getUserValues, "f").call(this);
            yield this.goToNextStep(values);
        }));
        this.containter = config.parentElement || document;
        this.stepsContainter = this.containter.querySelector('.script-chat-messages-container');
        this.textFieldElement = this.containter.querySelector('.script-chat-textfield');
        this.nextStepButtonElement = this.containter.querySelector('.script-chat-next-step-button');
        this.controlElement = this.containter.querySelector('.script-chat-control');
    }
    init() {
        var _a;
        const message = this.replaceMessageValuesVariables(this.currentStep.message);
        __classPrivateFieldGet(this, _ScriptedChatJS_instances, "m", _ScriptedChatJS_renderOwnerMessage).call(this, message);
        const currentType = this.currentStep.input;
        if (__classPrivateFieldGet(this, _ScriptedChatJS_instances, "m", _ScriptedChatJS_isTextField).call(this)) {
            __classPrivateFieldGet(this, _ScriptedChatJS_instances, "m", _ScriptedChatJS_showControl).call(this);
            __classPrivateFieldGet(this, _ScriptedChatJS_instances, "m", _ScriptedChatJS_showTextField).call(this, currentType);
        }
        (_a = this.nextStepButtonElement) === null || _a === void 0 ? void 0 : _a.addEventListener('click', (event) => {
            event.preventDefault();
            __classPrivateFieldGet(this, _ScriptedChatJS_handleNextStep, "f").call(this);
        });
    }
}
_ScriptedChatJS_getUserValues = new WeakMap(), _ScriptedChatJS_handleNextStep = new WeakMap(), _ScriptedChatJS_instances = new WeakSet(), _ScriptedChatJS_renderOwnerMessage = function _ScriptedChatJS_renderOwnerMessage(message) {
    var _a;
    const messageElement = document.createElement('span');
    messageElement.classList.add('script-chat-owner-message');
    messageElement.innerText = message;
    (_a = this.stepsContainter) === null || _a === void 0 ? void 0 : _a.appendChild(messageElement);
}, _ScriptedChatJS_renderUserMessage = function _ScriptedChatJS_renderUserMessage(message) {
    var _a;
    const messageElement = document.createElement('span');
    messageElement.classList.add('script-chat-user-message');
    messageElement.innerText = message;
    (_a = this.stepsContainter) === null || _a === void 0 ? void 0 : _a.appendChild(messageElement);
}, _ScriptedChatJS_hideControl = function _ScriptedChatJS_hideControl() {
    var _a;
    (_a = this.controlElement) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
}, _ScriptedChatJS_showControl = function _ScriptedChatJS_showControl() {
    var _a;
    (_a = this.controlElement) === null || _a === void 0 ? void 0 : _a.classList.remove('hidden');
}, _ScriptedChatJS_showTextField = function _ScriptedChatJS_showTextField(type = 'text') {
    var _a, _b, _c;
    (_a = this.textFieldElement) === null || _a === void 0 ? void 0 : _a.setAttribute('type', type);
    (_b = this.textFieldElement) === null || _b === void 0 ? void 0 : _b.setAttribute('aria-hidden', 'false');
    (_c = this.textFieldElement) === null || _c === void 0 ? void 0 : _c.removeAttribute('disabled');
}, _ScriptedChatJS_hideTextField = function _ScriptedChatJS_hideTextField() {
    var _a, _b;
    (_a = this.textFieldElement) === null || _a === void 0 ? void 0 : _a.setAttribute('aria-hidden', 'true');
    (_b = this.textFieldElement) === null || _b === void 0 ? void 0 : _b.setAttribute('disabled', 'true');
}, _ScriptedChatJS_isTextField = function _ScriptedChatJS_isTextField(input = this.currentStep.input) {
    return ['text', 'email', 'number', 'date', 'datetime-local'].includes(input);
};
