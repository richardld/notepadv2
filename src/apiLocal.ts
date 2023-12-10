import OpenAI from 'openai'
import Llama, {LlamaModel, LlamaContext, LlamaChatSession, LlamaChatPromptWrapper, Token} from "node-llama-cpp"
import path from 'path';
import isDev from 'electron-is-dev' 

const openai = new OpenAI({
  apiKey:"",
  baseURL:"http://localhost:1234/v1",
  dangerouslyAllowBrowser: true
})

export async function getResponseLocal(query: string, existingText: string, key: string, callback: (update: string, k: string) => void) {
  const modelPath = isDev ? './src/models/llama-2-7b-chat.gguf' : path.join(__dirname, '../../../llama-2-7b-chat.gguf');
  console.log(modelPath)
  const llama = await Llama

  const model = new llama.LlamaModel({
      modelPath: modelPath
  });

  const context = new llama.LlamaContext({
    model,
    contextSize: Math.min(512, model.trainContextSize),
  });

  let wrapper = new llama.LlamaChatPromptWrapper()
  const session = new llama.LlamaChatSession({
    systemPrompt: "You are a text generator for a notepad like application. Do not act like an assistant, instead simply do directly what is asked. Respond briefly.",
    contextSequence: context.getSequence(),
    promptWrapper: wrapper,
    conversationHistory: [{prompt: existingText, response: ""}]
  });

  const stream = await session.prompt(query, {
    onToken(chunk: Token[]) {
      let update = model.detokenize(chunk)
      callback(update, key);
    }
  });
  return stream
}

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