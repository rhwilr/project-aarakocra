import {contextBridge, ipcRenderer, app } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  getPlaylists: () => ipcRenderer.invoke('getPlaylists'),
  getPlaylistDetails: (id: string) => ipcRenderer.invoke('getPlaylistDetails', id),
  getPlaylistFile: (id: string, file: string) => ipcRenderer.invoke('getPlaylistFile', id, file),

  getEffects: () => ipcRenderer.invoke('getEffects'),
  getEffectDetails: (id: string) => ipcRenderer.invoke('getEffectDetails', id),
  getEffectFile: (id: string, file: string) => ipcRenderer.invoke('getEffectFile', id, file),
})
