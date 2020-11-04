import {atom, atomFamily, selectorFamily} from 'recoil'
import {localStorageEffect} from '../AtomEffects'
import {notNull} from '../../utils/Utils'

export type MessageType = {
  body: string,
  formatted_body: string,
  post_id: string,
  sender: string,
  id: string,
  server_ts: number,
  room_name: string
}

export const chatModalState = atom<boolean>({
  key: "ChatModalState",
  default: false
})

export const postMessageIdsState = atomFamily<Array<string>, string>({
  key: 'PostMessageIds',
  default: new Array<string>(),
  effects_UNSTABLE: post_id => [
    localStorageEffect(`CHUPACABRA_Message_Ids_Post_${post_id}`)
  ]
})

export const messageState = atomFamily<MessageType | null, string>({
  key: 'ChupacabraMessage',
  default: null,
  effects_UNSTABLE: message_id => [
    localStorageEffect(`CHUPACABRA_Message_${message_id}`)
  ]
})

export const postMessageIdSelector = selectorFamily<Array<string>, string>({
  key: "PostMessageList",
  get: post_id => ({get}) => {
    const messages = get(postMessageIdsState(post_id))
      .map(message_id => get(messageState(message_id))).filter(notNull)
    messages.sort((a, b) => b.server_ts - a.server_ts)
    return messages.map(message => message.id)
  }
})
