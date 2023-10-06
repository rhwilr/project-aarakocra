import { app } from 'electron'
import fs, {promises as promiseFs} from 'fs'
import path from 'path'
import { StorageFolder } from './config'

export const getEffects = async () => {
    const filePath = path.join(StorageFolder(), 'effects', 'effects.json')

    const buffer = await promiseFs.readFile(filePath, { encoding: 'utf8' });
    const json = JSON.parse(buffer)

    const effects = json.effects.map(effect => {
        const coverPath = path.join(StorageFolder(), 'effects', effect.id, 'cover.webp')

        return {
            ...effect,
            cover: fs.existsSync(coverPath) ? `aarakocra://file/effects/${effect.id}/cover.webp` : null
        }
    })

    return {
        effects
    }
}

export const getEffectDetails = async (event, id: string) => {
    const filePath = path.join(StorageFolder(), 'effects', id)

    const files = await promiseFs.readdir(filePath)

    return files.map(file => `aarakocra://file/effects/${id}/${file}`)
}

export const getEffectFile = async (event, id: string, file: string) => {
    const filePath = path.join(StorageFolder(), 'effects',  id, file)

    return await promiseFs.readFile(filePath)
}