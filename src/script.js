import { ScriptChat } from './index.js'

const scriptChat = new ScriptChat({
  script: [
    { id: 'start', next: 'end', message: 'Hello my friend' },
    {
      id: 'comment2',
      message: 'Hello my friend',
      next: 'end',
    },
  ],
})

console.log('hello')
scriptChat.init()
