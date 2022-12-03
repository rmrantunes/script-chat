# Scripted Chat

A simple code for defining scripted chat using Javascript

## Installation

```
yarn add script-chat
```

or

```
npm i script-chat
```

## Step

Required steps: `start` and `end`

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

## Script

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

## Variables

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

## Hooks

### `beforeStepChange`

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

### `afterStepChange`

You can't validate using this hook, but you still can keep track on step change.

### HookEvent object

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
