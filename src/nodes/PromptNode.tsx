import {DecoratorNode, TextNode } from 'lexical'
import React, { ReactNode } from 'react'
import type {
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedTextNode,
} from 'lexical';

import styles from './PromptNode.module.css'


export class PromptNode extends DecoratorNode<ReactNode> {
  static getType(): string {
    return 'prompt';
  }

  static clone(node: LexicalNode) {
    return new PromptNode(node.prompt, node.response, node.__key);
  }

  constructor(prompt: string, response: string, key?: NodeKey) {
    super(key);
    this.prompt = prompt;
    this.response = response ? response : "" 
  }

  static importJSON(serializedNode: SerializedTextNode) {
    const node = $createPromptNode(serializedNode.text);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }

  updateCompletion(update: string) {
    const writable = this.getWritable();
    writable.response = writable.response + update;
  }

  getPrompt() {
    const writable = this.getWritable();
    return writable.prompt
  }

  getResponse() {
    const writable = this.getWritable();
    return writable.response
  }

  createDOM(config: EditorConfig) {
    return document.createElement('div');
  }

  updateDOM() {
    return false
  }

  decorate(): ReactNode {
    return (
      <div>
        <p className={styles.prompt}>{this.prompt}</p>
        <p className={styles.response}>{this.response ? this.response.trim() : "Generating Response..."}</p>
      </div>
    )
  }
}

export function $createPromptNode(prompt: string) {
  return new PromptNode(prompt, null, null)
}

export function $isPromptNode(node: LexicalNode) {
  return node instanceof PromptNode;
}