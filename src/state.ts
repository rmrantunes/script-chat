import { Result, ScriptedChatStateConfig, Step, Variables } from './types'

function getVariableRegex(variable: string) {
  return new RegExp(`\\{\\{${variable}\\}\\}`, 'g')
}

export class ScriptedChatState {
  currentStep: Step
  script: Step[]
  results: Result[]
  config: ScriptedChatStateConfig
  customVariables: Variables

  constructor(config: ScriptedChatStateConfig) {
    this.script = config.script
    this.currentStep = this.getStep('start') || this.script[0]
    this.results = []
    this.config = config
    this.customVariables = this.config.customVariables || {}
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

  protected setStep(id: string) {
    const step = this.getStep(id)
    this.currentStep = step
    return step
  }

  replaceMessageValuesVariables(message: string) {
    let _message = message
    // Next implementation: {{start.2}} for multiple choice variables
    this.results.forEach((result) => {
      const regex = getVariableRegex(result.step)
      _message = _message.replace(regex, result.values.join(', '))
    })

    Object.entries(this.customVariables).forEach(([key, value]) => {
      const regex = getVariableRegex(key)
      _message = _message.replace(regex, value)
    })

    return _message
  }

  protected validateAndProceed = async (currentStepValues: any[]) => {
    const result = {
      step: this.currentStep.id,
      values: currentStepValues,
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

    if (!validation || !currentStepValues.length) return

    this.results.push(result)
    this.config.onNewUserMessage?.(currentStepValues)
    const currentAfterStepChange = this.currentStep.afterStepChange
    this.setStep(this.currentStep.next)

    const message = this.replaceMessageValuesVariables(nextStep.message)
    this.config.onNewStepMessage?.(message)

    const isEndStep = nextStep.id === 'end'

    if (isEndStep) {
      // remove all options inputs and button
      this.config.onEnd?.()
    } else {
      this.config.onContinue?.(nextStep)
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

  reset() {
    this.currentStep = this.getStep('start')
    this.results = []
  }

  setCustomVariable(key: string, value: string) {
    this.customVariables[key] = value
  }
}
