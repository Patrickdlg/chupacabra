import { atom, atomFamily } from 'recoil'
import {localStorageEffect} from '../Utils'

export type RoomType = {
  name: string,
  id: string
}

export type MatrixFilterType = {
  filter_id: string | null,
  last_batch: string | null,
  subscribed_room_ids: string | null
}

export const filterState = atom<MatrixFilterType | null>({
  key: 'MX_Filter',
  default: null,
  effects_UNSTABLE: [
    localStorageEffect('MX_Filter')
  ]
})

export const roomState = atomFamily<RoomType | null, string>({
  key: 'MX_Room',
  default: room_id => {return {id: room_id, name: room_id}},
  effects_UNSTABLE: room_id => [
    localStorageEffect(`MX_Room_${room_id}`)
  ]
})

export const roomIdsState = atom<Array<string>>({
  key: 'MX_Room_Ids',
  default: new Array<string>(),
  effects_UNSTABLE: [
    localStorageEffect('MX_Room_Ids')
  ]
})
