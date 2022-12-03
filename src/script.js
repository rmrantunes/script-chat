import { ScriptChat } from './index.js'

const scriptChat = new ScriptChat({
  script: [
    { id: 'start', next: 'step-1', message: 'Hello my friend' },
    {
      id: 'step-1',
      message: 'How are you?',
      next: 'end',
    },
    {
      id: 'end',
      message: 'Good to know!',
      next: '',
    },
  ],
})

console.log('hello')
scriptChat.init()
