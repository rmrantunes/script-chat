type StepName = 'start' | 'end'

type Input = 'text' | 'email'

type Step = {
  id: StepName | string
  next: StepName | string
  input: Input
  message: string

  // TODO: pass a context as argument and return other context such as vairables
  afterStepChange?: () => any
  beforeStepChange?: () => any
}

type ScriptChatConfig = {
  script: Step[]
}

type Value = {
  step: string
  values: string[]
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

  showTextField(type: 'text' | 'email' = 'text') {
    this.textFieldElement?.setAttribute('type', type)
    this.textFieldElement?.setAttribute('aria-hidden', 'false')
  }

  hideTextField() {
    this.textFieldElement?.setAttribute('aria-hidden', 'true')
  }

  #isTextField() {
    return ['text', 'email', 'number'].includes(this.currentStep.input)
  }

  getUserValue = () => {
    if (this.#isTextField()) {
      return this.textFieldElement?.value
    }
  }

  handleNextStep = () => {
    const value = this.getUserValue()
    console.log(value)

    if (!value) return

    this.renderUserMessage(value)
    // this.values[this.currentStep.id] = [value]

    const nextStep = this.setStep(this.currentStep.next)
    this.renderOwnerMessage(nextStep.message)

    if (nextStep.id === 'end') {
      // remove all options inputs and button
      this.hideTextField()
    }
  }

  init() {
    this.renderOwnerMessage(this.currentStep.message)
    const currentType = this.currentStep.input
    if (this.#isTextField()) {
      this.showTextField(currentType)
    }

    this.nextStepButtonElement?.addEventListener('click', this.handleNextStep)
  }
}
