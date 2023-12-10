// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  getResponse: (query: string, existingText: string, key: string) => {
    console.log(query, existingText, key)
    return ipcRenderer.invoke('languageModel:getResponse', query, existingText, key)
  },
  onUpdate: (callback: (value: string, key: string) => void) => ipcRenderer.on('languageModel:update', (_event, value, key) => callback(value, key))
})