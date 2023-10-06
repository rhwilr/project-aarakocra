import { InjectionKey, ComputedRef, Ref } from 'vue'

export const PlaylistVolume: InjectionKey<ComputedRef<number>> = Symbol('PlaylistVolume')
export const PlaylistExclusive: InjectionKey<{
    exclusivePlaylist: Ref<string|null>
    updateExclusivePlaylist: (value: string) => void
}> = Symbol('PlaylistExclusive')

export const EffectVolume: InjectionKey<ComputedRef<number>> = Symbol('EffectVolume')