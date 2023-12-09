import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey:"",
  baseURL:"http://localhost:1234/v1",
  dangerouslyAllowBrowser: true
})

export async function getResponse(prompt:string, existingText:string, callback: (a: string) => void) {
  const streamingParams: OpenAI.Chat.ChatCompletionCreateParams = {
    model: '',
    messages: [
      { role: 'system', content: "You are a text generator for a notepad like application. Do not act like an assistant, instead simply do directly what is asked. Respond briefly." },
      { role: 'user', content: existingText},
      { role: 'user', content: prompt }
    ],
    stream: true,
  };
  
  const stream = await openai.chat.completions.create(streamingParams)

  for await (const chunk of stream) {
    callback(chunk.choices[0]?.delta?.content || '')
  }

  return stream
}