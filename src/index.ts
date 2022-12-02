type StepName = 'start' | 'end'

type Input = 'text' | 'email'

type Step = {
  id: StepName | string
  next: StepName | string
  input?: Input
  message: string

  // TODO: pass a context as argument and return other context such as vairables
  afterStepChange?: () => any
  beforeStepChange?: () => any
}

type ScriptChatConfig = {
  script: Step[]
}

type Value = Record<string, string[]>

export class ScriptChat {
  stepsContainter: Element | null
  // inputElement: Element | null
  currentStep: Step
  script: Step[]
  // values: Value[]

  constructor(config: ScriptChatConfig) {
    this.stepsContainter = document.querySelector(
      '#script-chat-steps-container'
    )
    this.script = config.script
    this.currentStep = this.getStep('start') || this.script[0]

    console.log(this)
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
  }

  handleNextStep() {}
}
