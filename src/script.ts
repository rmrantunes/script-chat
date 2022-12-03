import { ScriptedChatState } from './state.js'
import { ScriptedChatJSConfig, TextFieldTypes } from './types'

export class ScriptedChatJS extends ScriptedChatState {
  containter: Element | Document
  stepsContainter: Element | null
  textFieldElement: HTMLInputElement | null
  nextStepButtonElement: Element | null
  controlElement: HTMLDivElement | null

  constructor(config: ScriptedChatJSConfig) {
    super({
      ...config,
      onNewOwnerMessage: (message) => {
        this.#renderOwnerMessage(message)
      },
      onNewUserMessage: (values) => {
        this.#renderUserMessage(values.join(', '))
      },
      onEnd: () => {
        this.#hideControl()
        this.#hideTextField()
      },
      onContinue: (nextStep) => {
        this.#isTextField(nextStep.input) && this.#showTextField(nextStep.input)
      },
    })
    this.containter = config.parentElement || document
    this.stepsContainter = this.containter.querySelector(
      '.script-chat-messages-container'
    )
    this.textFieldElement = this.containter.querySelector(
      '.script-chat-textfield'
    )
    this.nextStepButtonElement = this.containter.querySelector(
      '.script-chat-next-step-button'
    )
    this.controlElement = this.containter.querySelector('.script-chat-control')
  }

  #renderOwnerMessage(message: string) {
    const messageElement = document.createElement('span')
    messageElement.classList.add('script-chat-owner-message')
    messageElement.innerText = message

    this.stepsContainter?.appendChild(messageElement)
  }

  #renderUserMessage(message: string) {
    const messageElement = document.createElement('span')
    messageElement.classList.add('script-chat-user-message')
    messageElement.innerText = message

    this.stepsContainter?.appendChild(messageElement)
  }

  #hideControl() {
    this.controlElement?.classList.add('hidden')
  }

  #showControl() {
    this.controlElement?.classList.remove('hidden')
  }

  #showTextField(type: TextFieldTypes = 'text') {
    this.textFieldElement?.setAttribute('type', type)
    this.textFieldElement?.setAttribute('aria-hidden', 'false')
    this.textFieldElement?.removeAttribute('disabled')
  }

  #hideTextField() {
    this.textFieldElement?.setAttribute('aria-hidden', 'true')
    this.textFieldElement?.setAttribute('disabled', 'true')
  }

  #isTextField(input = this.currentStep.input) {
    return ['text', 'email', 'number', 'date', 'datetime-local'].includes(input)
  }

  #getUserValues = () => {
    if (this.#isTextField()) {
      return [this.textFieldElement?.value]
    }
    return []
  }

  #handleNextStep = async () => {
    const values = this.#getUserValues()
    await this.goToNextStep(values)
  }

  #nextStepButtonHandler = (event: Event) => {
    event.preventDefault()
    this.#handleNextStep()
  }

  init() {
    this.setStep('start')
    const message = this.replaceMessageValuesVariables(this.currentStep.message)
    this.#renderOwnerMessage(message)
    const currentType = this.currentStep.input
    if (this.#isTextField()) {
      this.#showControl()
      this.#showTextField(currentType)
    }

    this.nextStepButtonElement?.addEventListener(
      'click',
      this.#nextStepButtonHandler
    )
  }

  cleanup() {
    this.stepsContainter!.innerHTML = ''
    this.nextStepButtonElement?.removeEventListener(
      'click',
      this.#nextStepButtonHandler
    )
  }
}
