// 整合封装 vue3 composition api
import { ref } from 'vue'
import { StreamGpt, Typewriter, GptMsgs } from './GptStream'
export const useGpt = (key: string, history: boolean = false) => {
  const streamingText = ref('')
  const streaming = ref(false)
  const msgList = ref<GptMsgs>([])
  const typewriter = new Typewriter((str: string) => {
    streamingText.value += str || ''
  })
  const gpt = new StreamGpt(key, {
    onStart: (prompt: string) => {
      streamingText.value = ''
      streaming.value = true
      msgList.value.push({
        role: 'user',
        content: prompt
      })
    },
    onPatch: (text: string) => {
      typewriter.add(text)
    },
    onCreated: () => {
      typewriter.start()
    },
    onDone: () => {
      typewriter.done()
      streaming.value = false
      msgList.value.push({
        role: 'assistant',
        content: streamingText.value
      })
    }
  })
  // 如果是history模式，则在strame时将msgList传入
  const stream = (prompt: string,aiModel:string='gpt-3.5-turbo') => {
    gpt.stream(prompt, history ? msgList.value : undefined,aiModel)
  }
  return {
    streamingText,
    streaming,
    msgList,
    stream
  }
}