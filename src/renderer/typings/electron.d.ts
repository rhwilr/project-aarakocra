/**
 * Should match main/preload.ts for typescript support in renderer
 */
export default interface ElectronApi {
  getPlaylists: () => { playlists: Playlist[] }
  getPlaylistDetails: (id: string) => [string],
  getPlaylistFile: (id: string, file: string) => Uint8Array,

  getEffects: () => { effects: Effect[] }
  getEffectDetails: (id: string) => [string],
  getEffectFile: (id: string, file: string) => Uint8Array,
}

declare global {
  interface Window {
    electronAPI: ElectronApi,
  }
}
