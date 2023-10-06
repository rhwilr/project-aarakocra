import { app } from 'electron'
import fs, {promises as promiseFs} from 'fs'
import path from 'path'
import { StorageFolder } from './config'

export const getPlaylists = async () => {
    const filePath = path.join(StorageFolder(), 'playlists', 'playlists.json')

    const buffer = await promiseFs.readFile(filePath, { encoding: 'utf8' });
    const json = JSON.parse(buffer)

    const playlists = json.playlists.map(playlist => {
        const coverPath = path.join(StorageFolder(), 'playlists', playlist.id, 'cover.webp')

        return {
            ...playlist,
            cover: fs.existsSync(coverPath) ? `aarakocra://file/playlists/${playlist.id}/cover.webp` : null
        }
    })

    return {
        playlists
    }
}

export const getPlaylistDetails = async (event, id: string) => {
    const filePath = path.join(StorageFolder(), 'playlists', id)

    const files = await promiseFs.readdir(filePath)

    return files.map(file => `aarakocra://file/playlists/${id}/${file}`)
}

export const getPlaylistFile = async (event, id: string, file: string) => {
    const filePath = path.join(StorageFolder(), 'playlists',  id, file)

    return await promiseFs.readFile(filePath)
}