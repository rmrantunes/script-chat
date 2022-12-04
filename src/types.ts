export type StepName = 'start' | 'end' | 'datetime-local'

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

  /** Step-level `beforeProceed` overrides the global one
   * - Use this hook to validade a user input. So you need to return a boolean.
   * If there's no checking, just return `true`.
   */
  beforeProceed?: (event: HookEvent) => boolean | Promise<boolean>
  afterProceed?: (event: HookEvent) => void | Promise<void>
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

export type Variables = Record<string, string>

export type ScriptedChatJSConfig = {
  script: Step[]
  customVariables?: Variables
  /**
   * - Use this hook to validade a user input. So you need to return a boolean.
   * If there's no checking, just return `true`.
   */
  beforeProceed?: (event: HookEvent) => boolean | Promise<boolean>
  afterProceed?: (event: HookEvent) => void | Promise<void>

  parentElement?: Element
}

export type ScriptedChatStateConfig = {
  script: Step[]
  customVariables?: Variables

  onNewStepMessage?: (message: string) => void
  onNewUserMessage?: (values: string[]) => void

  onEnd?: VoidFunction
  onContinue?: (nextStep: Step) => void

  /**
   * - Use this hook to validade a user input. So you need to return a boolean.
   * If there's no checking, just return `true`.
   */
  beforeProceed?: (event: HookEvent) => boolean | Promise<boolean>
  afterProceed?: (event: HookEvent) => void | Promise<void>
}
