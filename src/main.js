'use strict'
import { ScriptChat } from './index.js'
import { ScriptState } from './script.js'

const scriptChat = new ScriptState({
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
      beforeStepChange: async (event) => {
        return true
      },
      afterStepChange: (input) => {
        console.log('after:step', input)
      },
    },
    {
      id: 'step-1',
      message: 'How are you, {{start}}?',
      next: 'step-2',
      input: 'text',
    },
    {
      id: 'step-2',
      message: "What's your birhday?",
      next: 'end',
      input: 'datetime-local',
    },
    {
      id: 'end',
      message: 'Good to know!',
      next: '',
      input: 'text',
    },
  ],
})

console.log(scriptChat)
scriptChat.goToNextStep(['Test qweui'])
console.log(scriptChat)
