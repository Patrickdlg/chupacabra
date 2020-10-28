import { atom, selectorFamily} from 'recoil'
import {PostType} from './feed'

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

export const messagesState = atom<Map<string, MessageType>>({
  key: 'MessageMap',
  default: new Map<string, MessageType>()
})

export const postMessagesSelector = selectorFamily<Array<MessageType>, PostType>({
  key: "MessageList",
  get: (post: PostType) => ({get}) => {
    const messageMap = get(messagesState)
    const messages = Array.from(messageMap.values()).filter((m: MessageType) =>
      post.room_name === m.room_name && m.post_id === post.id
    )
    messages.sort((a: MessageType, b: MessageType) => b.server_ts - a.server_ts)
    return messages
  }
})
