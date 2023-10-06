import {app, ipcMain} from 'electron'
import { getPlaylists, getPlaylistDetails, getPlaylistFile } from './playlists'
import { getEffects, getEffectDetails, getEffectFile } from './effects'

export const setupBackend = () => {
    ipcMain.handle('getPlaylists', getPlaylists)
    ipcMain.handle('getPlaylistDetails', getPlaylistDetails)
    ipcMain.handle('getPlaylistFile', getPlaylistFile)

    ipcMain.handle('getEffects', getEffects)
    ipcMain.handle('getEffectDetails', getEffectDetails)
    ipcMain.handle('getEffectFile', getEffectFile)
}
