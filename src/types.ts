export type StepName = 'start' | 'end'

export type TextFieldTypes =
  | 'text'
  | 'email'
  | 'number'
  | 'date'
  | 'datetime-local'

export type Step = {
  id: StepName | string
  next: StepName | string
  input: TextFieldTypes
  message: string

  /** Step-level `beforeStepChange` overrides the global one
   * - Use this hook to validade a user input. So you need to return a boolean.
   * If there's no checking, just return `true`.
   */
  beforeStepChange?: (event: HookEvent) => boolean | Promise<boolean>
  afterStepChange?: (event: HookEvent) => void | Promise<void>
}

export type HookEvent = {
  currentStep: Step
  nextStep: Step | null

  result: Result
  results: Result[]
}

export type Result = {
  step: string
  values: (string | undefined)[]
}

export type ScriptChatConfig = {
  script: Step[]

  /**
   * - Use this hook to validade a user input. So you need to return a boolean.
   * If there's no checking, just return `true`.
   */
  beforeStepChange?: (event: HookEvent) => boolean | Promise<boolean>
  afterStepChange?: (event: HookEvent) => void | Promise<void>

  parentElement?: Element
}

export type ScriptStateConfig = {
  script: Step[]

  onNewOwnerMessage?: (message: string) => void
  onNewUserMessage?: (values: string[]) => void

  onEnd?: VoidFunction
  onContinue?: (nextStep: Step) => void

  /**
   * - Use this hook to validade a user input. So you need to return a boolean.
   * If there's no checking, just return `true`.
   */
  beforeStepChange?: (event: HookEvent) => boolean | Promise<boolean>
  afterStepChange?: (event: HookEvent) => void | Promise<void>
}
