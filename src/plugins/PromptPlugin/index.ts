import { PromptNode, $createPromptNode } from "../../nodes/PromptNode";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { DecoratorNode, TextNode, NodeKey, $getRoot, createCommand, $createTextNode, $createLineBreakNode, CommandListener } from 'lexical';
import { ReactNode, useEffect } from "react";
import { getResponse } from "../../api"
import { HashtagNode } from "@lexical/hashtag"; 

interface Payload {
  update: string;
  promptNode: PromptNode;
}
export function PromptPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext()
  const UPDATE_COMPLETION_COMMAND = createCommand()
  const FINISH_COMPLETION_COMMAND = createCommand()

  useEffect(() => {
    if (!editor.hasNodes([PromptNode])) {
      throw new Error('TwitterPlugin: TweetNode not registered on editor (initialConfig.nodes)');
    }

    editor.registerCommand(
      UPDATE_COMPLETION_COMMAND,
      (payload: Payload): any => {
        let update = payload.update
        let promptNode = payload.promptNode
        promptNode.updateCompletion(update)
      },
      1,
    )

    editor.registerCommand(
      FINISH_COMPLETION_COMMAND,
      (payload: Payload): any => {
        let promptNode = payload.promptNode
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

    editor.registerNodeTransform(HashtagNode, textNode => {
      const regex = /\\([^\\])+\\/i
      const found = textNode.getTextContent().match(regex)
      if (found) {
          // Create a new TextNode
          const prompt = found[0].replaceAll("\\", "").trim()
          const promptNode = $createPromptNode(prompt)
          const existingText = $getRoot().getTextContent()
          const response = getResponse(prompt, existingText, (update) => {
            editor.dispatchCommand(UPDATE_COMPLETION_COMMAND, {
              update: update,
              promptNode: promptNode
            })
          })
        
          // Finally, append the paragraph to the root
          textNode.replace(promptNode);

          response.then(() => {
            editor.dispatchCommand(FINISH_COMPLETION_COMMAND, {
              promptNode: promptNode
            })
          })
      }
    })
  }, [editor]);

  return null;
}