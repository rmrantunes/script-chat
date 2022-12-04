'use strict'
import { ScriptedChatJS } from '../dist/script.js'
// import { ScriptedChatState, ScriptedChatJS } from 'scripted-chat'
// import { ScriptState } from './script.js'

const scriptChat = new ScriptedChatJS({
  customVariables: {
    custom1: 'Custom hehe',
  },
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
      message: 'Good to know!, {{custom1}}',
      next: '',
      input: 'text',
    },
  ],
})

console.log(scriptChat)

scriptChat.init()
