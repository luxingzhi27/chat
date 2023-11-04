
const parsePack = (str: string) => {
    // 定义正则表达式匹配模式
    const pattern = /data:\s*({.*?})\s*\n/g
    // 定义一个数组来存储所有匹 配到的 JSON 对象
    const result = []
    // 使用正则表达式匹配完整的 JSON 对象并解析它们
    let match
    while ((match = pattern.exec(str)) !== null) {
        const jsonStr = match[1]
        try {
        const json = JSON.parse(jsonStr)
        result.push(json)
        } catch (e) {
        console.log(e)
        }
    }
    // 输出所有解析出的 JSON 对象
    return result
}

export interface GptMsg {
  role: string
  content: string
}

export type GptMsgs = Array<GptMsg>
export class StreamGpt {
  onStart: (prompt: string) => void
  onCreated: () => void
  onDone: () => void
  onPatch: (text: string) => void
  constructor(private key: string, options: {
    onStart: (prompt: string) => void
    onCreated: () => void
    onDone: () => void
    onPatch: (text: string) => void
  }) {
    const { onStart, onCreated, onDone, onPatch } = options
    this.onStart = onStart
    this.onCreated = onCreated
    this.onPatch = onPatch
    this.onDone = onDone
  }



  async stream(prompt: string, history: GptMsgs = [],aiModel:string) {
    let finish = false
    let count = 0
    // 触发onStart
    this.onStart(prompt)
    // 发起请求
    const res = await this.fetch(history,aiModel)
    if (!res.body) return
    // 从response中获取reader
    const reader = res.body.getReader()
    const decoder: TextDecoder = new TextDecoder()
    // 循环读取内容
    while (!finish) {
      const { done, value } = await reader.read()
      // console.log(value)
      if (done) {
        finish = true
        this.onDone()
        break
      }
      count++
      const jsonArray = parsePack(decoder.decode(value))
      if (count === 1) {
        this.onCreated()
      }
      jsonArray.forEach((json: any) => {
        if (!json.choices || json.choices[0].finish_reaso === "stop") {
          return
        }
        const text = json.choices[0].delta.content
        this.onPatch(text)
      })
    }
  }

  async fetch(messages: GptMsgs,aiModel:string) {
    return await fetch('http://flag.smarttrot.com/index.php/api/v1/chat/completions', {
      method: 'POST',
      body: JSON.stringify({
        model: aiModel,
        messages,
        stream: true
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.key}`
      }
    })
  }
}

// 打字机队列
export class Typewriter {
  private queue: string[] = []
  private consuming = false
  private timmer: any
  constructor(private onConsume: (str: string) => void) {
  }
  // 输出速度动态控制
  dynamicSpeed() {
    const speed = 2000 / this.queue.length
    if (speed > 200) {
      return 200
    } else {
      return speed
    }
  }
  // 添加字符串到队列
  add(str: string) {
    if (!str) return
    this.queue.push(...str.split(''))
  }
  // 消费
  consume() {
    if (this.queue.length > 0) {
      const str = this.queue.shift()
      str && this.onConsume(str)
    }
  }
  // 消费下一个
  next() {
    this.consume()
    // 根据队列中字符的数量来设置消耗每一帧的速度，用定时器消耗
    this.timmer = setTimeout(() => {
      this.consume()
      if (this.consuming) {
        this.next()
      }
    }, this.dynamicSpeed())
  }
  // 开始消费队列
  start() {
    this.consuming = true
    this.next()
  }
  // 结束消费队列
  done() {
    this.consuming = false
    clearTimeout(this.timmer)
    // 把queue中剩下的字符一次性消费
    this.onConsume(this.queue.join(''))
    this.queue = []
  }
}
