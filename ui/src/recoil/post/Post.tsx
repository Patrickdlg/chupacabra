import { atomFamily } from 'recoil'
import {localStorageEffect} from '../AtomEffects'

export type PostType = {
  chupacabra_source: string,
  title: string,
  uri: string,
  room_name: string,
  id: string,
  server_ts: number,
  pending: boolean,
  pending_send_room: string,
  origin_uri: string
}

export const postState = atomFamily<PostType | null, string>({
  key: 'Chupacabra_Post',
  default: null,
  effects_UNSTABLE: post_id => [
    localStorageEffect(`CHUPACABRA_Post_${post_id}`)
  ]
})
