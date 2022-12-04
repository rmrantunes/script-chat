# Scripted Chat

A simple code for defining scripted chat using Javascript

## Installation

```
yarn add scripted-chat
```

or

```
npm i scripted-chat
```

## Get Started

```ts
import { ScriptedChatState } from 'scripted-chat'

const scriptControls = new ScriptedChatState(config)
```

Before moving on to the `config` object and the other `ScriptedChatState` methods, learn the basics of `Step` and `Script`.

### Step

```ts
const step = {
  id: 'start',
  message: 'Hi, this is my first message. How are you?',
  next: 'user_name',
  input: 'text',
}
```

- `id`: step identifier
- `message`: message defined for user interaction
- `next`: next step id.
  - Required: `start` and `end`
- `input`: input types
  - `text`, `email`, `number`, `date`

### Script

Is the combination of steps

```ts
const script = [
  {
    id: 'start',
    message: 'Hi, this is my first message. How are you?',
    next: 'user_name',
    input: 'text',
  },
  {
    id: 'user_name',
    message: "What's your name?",
    next: 'end',
    input: 'text',
  },
  {
    id: 'end',
    message: 'Nice to meet you!',
    next: '',
    input: '',
  },
]
```

### Basic config

The most important basic thing about the `config` is defining the chat steps. You can see other `methods` later down.

```ts
import { ScriptedChatState } from 'scripted-chat'

const script = [
  /** steps */
]

const scriptControls = new ScriptedChatState({
  script,
})
```

### Script Controls

- `currentStep`: current step object
- `script`: array of steps
- `results`: an array containing previous results

- `getStep: (id: string) => Step`: get a certain step by id
- `getNextStep: () => Step`: get the next step object
- `setStep: (id: string) => Step`: set a new `currentStep`
  - In current version, hooks do not work with this method yet
- `reset:() => void`: reset `results` and `currentStep`
- `validateAndProceed: (currentStepValues: any[]) => Promise<void>`: pass an array of values (user input) to proceed with your script

- `replaceMessageValuesVariables: (message: string) => string
`: Already implemented inside `validateAndProceed`. Replace message variables with previous results values.
  (See more about variables in Advanced section)

## Advanced

### Variables

You can interpolate user input values inside next step messages using `{{step_id}}`

```ts
const script = [
  {
    id: 'start',
    message: 'Hi, this is my first message. How are you?',
    next: 'user_name',
    input: 'text',
  },
  {
    id: 'user_name',
    message: "What's your name?",
    next: 'end',
    input: 'text',
  },
  {
    id: 'end',
    message: 'Nice to meet you, {{user_name}}!',
    next: '',
    input: '',
  },
]
```

### Hooks

#### `beforeStepChange`

Use this hook to validade a user input returning a boolean.
If there's no checking, just return `true`.

```ts
const script = [
  {
    id: 'start',
    message: 'Hi, this is my first message. How are you?',
    next: 'user_name',
    input: 'text',
  },
  {
    id: 'user_name',
    message: "What's your name?",
    next: 'end',
    input: 'text',
    beforeStepChange(event) {
      const { values } = event.result
      return !!values[0]?.length
    },
  },
  {
    id: 'end',
    message: 'Nice to meet you, {{user_name}}!',
    next: '',
    input: '',
  },
]
```

#### `afterStepChange`

You can't validate using this hook, but you still can keep track on step change.

#### HookEvent object

```ts
type HookEvent = {
  currentStep: Step
  nextStep: Step | null
  result: Result
  results: Result[]
}

type Result = {
  step: string
  values: (string | undefined)[]
}
```

- `currentStep`: current step object
- `nextStep`: next step object
- `result`: current step user input result
- `results`: an array containing previous results
