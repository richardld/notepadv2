import {useState, useEffect} from 'react'
import styles from './text.module.css'

import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {PlainTextPlugin} from '@lexical/react/LexicalPlainTextPlugin';
import { EditorState, TextNode } from 'lexical';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import {HashtagPlugin} from '@lexical/react/LexicalHashtagPlugin'
import {HashtagNode} from "@lexical/hashtag";
import { KeywordNode } from '../nodes/KeywordNode';
import { KeywordPlugin } from '../plugins/KeywordPlugin'
import { PromptNode } from '../nodes/PromptNode';
import { PromptPlugin } from '../plugins/PromptPlugin';
import React from 'react';

const theme = {
  placeholder: styles.editorPlaceholder,
  paragraph: styles.editorParagraph,
  hashtag: styles.hashtag
};

function onError(error: any) {
  console.error(error);
}

const initialConfig = {
  namespace: 'Editor',
  theme,
  onError,
  nodes: [HashtagNode, PromptNode]
};

export default function Text() {
  const [editorState, setEditorState] = useState<EditorState>();

  function onChange(editorState: EditorState) {
    setEditorState(editorState);
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className={styles.editorContainer}>
        <PlainTextPlugin
          contentEditable={<ContentEditable className={styles.editorInput}/>}
          ErrorBoundary={LexicalErrorBoundary}
          placeholder={null}
        />
        <HistoryPlugin/>
        <OnChangePlugin onChange={onChange}/>
        <PromptPlugin/>
        <KeywordPlugin/>
      </div>
    </LexicalComposer>
  );
}