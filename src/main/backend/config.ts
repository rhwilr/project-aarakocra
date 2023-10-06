import { app } from 'electron'
import path from 'path'

export const StorageFolder = () => path.join(app.getPath('music'), 'ProjectAarakocra')