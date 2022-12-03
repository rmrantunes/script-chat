type StepName = 'start' | 'end'

type TextFieldTypes = 'text' | 'email' | 'number'

type Step = {
  id: StepName | string
  next: StepName | string
  input: TextFieldTypes
  message: string

  // TODO: pass a context as argument and return other context such as vairables
  afterStepChange?: () => any
  beforeStepChange?: () => any
}

type Value = {
  step: string
  stepValue: (string | undefined)[]
}

type ScriptChatConfig = {
  script: Step[]
}

export class ScriptChat {
  containter: Element | null
  stepsContainter: Element | null
  textFieldElement: HTMLInputElement | null
  nextStepButtonElement: Element | null
  currentStep: Step
  script: Step[]
  values: Value[]

  constructor(config: ScriptChatConfig) {
    this.containter = document.querySelector('#script-chat-container')
    this.stepsContainter = document.querySelector(
      '#script-chat-messages-container'
    )
    this.textFieldElement = document.querySelector('#script-chat-textfield')
    this.nextStepButtonElement = document.querySelector(
      '#script-chat-next-step-button'
    )
    this.script = config.script
    this.currentStep = this.getStep('start') || this.script[0]
    this.values = []
  }

  getStep(id: string) {
    return this.script.find((step) => step.id === id)
  }

  getNextStep() {
    return this.getStep(this.currentStep.next)
  }

  setStep(id: string) {
    const step = this.getStep(id)
    if (!step) {
      throw new Error(`Script does not contain step '${id}'`)
    }
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

  showTextField(type: TextFieldTypes = 'text') {
    this.textFieldElement?.setAttribute('type', type)
    this.textFieldElement?.setAttribute('aria-hidden', 'false')
    this.textFieldElement?.removeAttribute('disabled')
  }

  hideTextField() {
    this.textFieldElement?.setAttribute('aria-hidden', 'true')
    this.textFieldElement?.setAttribute('disabled', 'true')
  }

  #isTextField() {
    return ['text', 'email', 'number'].includes(this.currentStep.input)
  }

  #replaceMessageValuesVariables(message: string) {
    let _message = message
    this.values.forEach((value) => {
      const regex = new RegExp(`\\{\\{${value.step}\\}\\}`, 'g')
      _message = _message.replace(regex, value.stepValue.join(', '))
    })

    return _message
  }

  getUserValues = () => {
    if (this.#isTextField()) {
      return [this.textFieldElement?.value]
    }
    return []
  }

  handleNextStep = () => {
    const values = this.getUserValues()

    if (!values.length) return

    this.values.push({
      step: this.currentStep.id,
      stepValue: values,
    })

    this.renderUserMessage(values.join(', '))

    const nextStep = this.setStep(this.currentStep.next)

    const message = this.#replaceMessageValuesVariables(nextStep.message)
    this.renderOwnerMessage(message)

    if (nextStep.id === 'end') {
      // remove all options inputs and button
      this.hideTextField()
    }
  }

  init() {
    const message = this.#replaceMessageValuesVariables(
      this.currentStep.message
    )
    this.renderOwnerMessage(message)
    const currentType = this.currentStep.input
    if (this.#isTextField()) {
      this.showTextField(currentType)
    }

    this.nextStepButtonElement?.addEventListener('click', this.handleNextStep)
  }
}
