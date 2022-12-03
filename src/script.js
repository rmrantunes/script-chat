import { ScriptChat } from './index.js'

const scriptChat = new ScriptChat({
  beforeStepChange: (input) => {
    console.log('before', input)

    return true
  },
  afterStepChange: (input) => {
    console.log('after', input)
  },
  script: [
    {
      id: 'start',
      next: 'step-1',
      message: "What's your name?",
      input: 'text',
    },
    {
      id: 'step-1',
      message: 'How are you, {{start}}?',
      next: 'end',
      input: 'text',
    },
    {
      id: 'end',
      message: 'Good to know!',
      next: '',
      input: 'text',
    },
  ],
})

console.log('hello')
scriptChat.init()
