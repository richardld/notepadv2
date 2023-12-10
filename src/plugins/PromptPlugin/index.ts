import { PromptNode, $createPromptNode } from "../../nodes/PromptNode";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { DecoratorNode, TextNode, NodeKey, $getRoot, createCommand, $createTextNode, $createLineBreakNode, CommandListener, $getNodeByKey } from 'lexical';
import { ReactNode, useEffect } from "react";
import { getResponse } from "../../api"
import { HashtagNode } from "@lexical/hashtag"; 
import { ipcRenderer } from "electron";

interface Payload {
  update: string;
  key: string;
}

declare global {
  interface Window {
    electronAPI?: any;
  }
}

export function PromptPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext()
  const UPDATE_COMPLETION_COMMAND = createCommand()
  const FINISH_COMPLETION_COMMAND = createCommand()

  const promptNodes: { [id: string] : PromptNode } = {}

  useEffect(() => {
    if (!editor.hasNodes([PromptNode])) {
      throw new Error('TwitterPlugin: TweetNode not registered on editor (initialConfig.nodes)');
    }

    editor.registerCommand(
      UPDATE_COMPLETION_COMMAND,
      (payload: Payload): any => {
        let update = payload.update
        let promptNode = $getNodeByKey(payload.key)
        promptNode.updateCompletion(update)
      },
      1,
    )

    window.electronAPI.onUpdate((value: string, key: string) => {
      editor.dispatchCommand(UPDATE_COMPLETION_COMMAND, {
        update: value,
        key: key
      })
    })

    editor.registerCommand(
      FINISH_COMPLETION_COMMAND,
      (payload: Payload): any => {
        let promptNode = $getNodeByKey(payload.key)

        let textNode = $createTextNode(promptNode.getResponse().trim())
        promptNode.replace(textNode)
        textNode.insertAfter($createLineBreakNode())
        textNode.insertAfter($createLineBreakNode())

        let textNodePrompt = $createTextNode(promptNode.getPrompt())

        textNode.insertBefore(textNodePrompt)
        textNode.insertBefore($createLineBreakNode())
        textNode.insertBefore($createLineBreakNode())
      },
      1,
    )

    editor.registerNodeTransform(HashtagNode, async textNode => {
      const regex = /\\([^\\])+\\/i
      const found = textNode.getTextContent().match(regex)
      if (found) {
          // Create a new TextNode
          const prompt = found[0].replaceAll("\\", "").trim()
          const promptNode = $createPromptNode(prompt)
          const existingText = $getRoot().getTextContent()

          textNode.replace(promptNode)
          let key = promptNode.getKey()
          const response = window.electronAPI.getResponse(prompt, existingText, key)

          if (false) {
            const response = getResponse(prompt, existingText, (update) => {
              editor.dispatchCommand(UPDATE_COMPLETION_COMMAND, {
                update: update,
                promptNode: promptNode
              })
            })
          }

          // Finally, append the paragraph to the root

          response.then(() => {
            editor.dispatchCommand(FINISH_COMPLETION_COMMAND, {
              key: promptNode.getKey()
            })
          })
        }
      
    })
  }, [editor]);

  return null;
}