import { Result, ScriptChatConfig, Step, TextFieldTypes } from './types'

export class ScriptChat {
  containter: Element | Document
  stepsContainter: Element | null
  textFieldElement: HTMLInputElement | null
  nextStepButtonElement: Element | null
  controlElement: HTMLDivElement | null
  currentStep: Step
  script: Step[]
  results: Result[]
  config: ScriptChatConfig

  constructor(config: ScriptChatConfig) {
    this.containter = config.parentElement || document
    this.stepsContainter = this.containter.querySelector(
      '#script-chat-messages-container'
    )
    this.textFieldElement = this.containter.querySelector(
      '#script-chat-textfield'
    )
    this.nextStepButtonElement = this.containter.querySelector(
      '#script-chat-next-step-button'
    )
    this.controlElement = this.containter.querySelector('.script-chat-control')
    this.script = config.script
    this.currentStep = this.getStep('start') || this.script[0]
    this.results = []
    this.config = config
  }

  getStep(id: string) {
    const step = this.script.find((step) => step.id === id)
    if (!step) {
      throw new Error(`Script does not contain step '${id}'`)
    }
    return step
  }

  getNextStep() {
    return this.getStep(this.currentStep.next)
  }

  setStep(id: string) {
    const step = this.getStep(id)
    this.currentStep = step
    return step
  }

  renderOwnerMessage(message: string) {
    const messageElement = document.createElement('span')
    messageElement.classList.add('script-chat-owner-message')
    messageElement.innerText = message

    this.stepsContainter?.appendChild(messageElement)
  }

  renderUserMessage(message: string) {
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

  #replaceMessageValuesVariables(message: string) {
    let _message = message
    // Next implementation: {{start.2}} for multiple choice variables
    this.results.forEach((result) => {
      const regex = new RegExp(`\\{\\{${result.step}\\}\\}`, 'g')
      _message = _message.replace(regex, result.values.join(', '))
    })

    return _message
  }

  getUserValues = () => {
    if (this.#isTextField()) {
      return [this.textFieldElement?.value]
    }
    return []
  }

  handleNextStep = async () => {
    const values = this.getUserValues()
    const result = {
      step: this.currentStep.id,
      values,
    }
    const nextStep = this.getNextStep()

    let validation = true

    if (this.currentStep.beforeStepChange || this.config.beforeStepChange) {
      const beforeStepChangeEvent = {
        result,
        currentStep: this.currentStep,
        nextStep,
        results: this.results,
      }
      const hook =
        this.currentStep.beforeStepChange || this.config.beforeStepChange
      validation = await hook!(beforeStepChangeEvent)
    }

    if (!validation || !values.length) return

    this.results.push(result)
    this.renderUserMessage(values.join(', '))
    const currentAfterStepChange = this.currentStep.afterStepChange
    this.setStep(this.currentStep.next)

    const message = this.#replaceMessageValuesVariables(nextStep.message)
    this.renderOwnerMessage(message)

    const isEndStep = nextStep.id === 'end'

    if (isEndStep) {
      // remove all options inputs and button
      this.#hideControl()
      this.#hideTextField()
    } else {
      this.#isTextField(nextStep.input) && this.#showTextField(nextStep.input)
    }

    const afterStepChangeEvent = {
      result,
      results: this.results,
      currentStep: nextStep,
      nextStep: isEndStep ? null : this.getStep(nextStep.next),
    }

    await this.config.afterStepChange?.(afterStepChangeEvent)
    await currentAfterStepChange?.(afterStepChangeEvent)
  }

  init() {
    const message = this.#replaceMessageValuesVariables(
      this.currentStep.message
    )
    this.renderOwnerMessage(message)
    const currentType = this.currentStep.input
    if (this.#isTextField()) {
      this.#showControl()
      this.#showTextField(currentType)
    }

    this.nextStepButtonElement?.addEventListener('click', (event) => {
      event.preventDefault()
      this.handleNextStep()
    })
  }
}
