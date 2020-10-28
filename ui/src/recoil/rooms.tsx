import {atom, selector, selectorFamily} from 'recoil'
import {getJoinedRooms} from '../matrix/Rooms'

export type RoomType = {
  id: string,
  name: string
}

export const joinedRoomsState = selector<Array<RoomType>>({
  key: 'JoinedRooms',
  get: async({get}) => {
    return await getJoinedRooms()
  }
})

export const followedRoomsState = atom<Set<string>>({
  key: 'FollowedRooms',
  default: new Set<string>()
})

export const roomStateById = selector<Map<string, RoomType>>({
  key: 'roomStateById',
  get: ({get}) => {
    const joined_rooms = get(joinedRoomsState)
    return new Map<string, RoomType>(joined_rooms.map(r => [r.id, r]))
  }
})

export const roomState = selectorFamily<RoomType, string>({
  key: 'RoomState',
  get: (id) => ({get}) => {
    return get(roomStateById).get(id) || {id: id, name: id}
  }
})
