import {useRecoilValue} from 'recoil'
import {credentialsState} from '../recoil/matrix/Auth'
import {PostType} from '../recoil/feed'
import {RoomParticipationApiFactory} from './client/index'
import { v4 as uuidv4 } from 'uuid'

export const useSendMessage = (post: PostType) => {
  const credentials = useRecoilValue(credentialsState)
  const sendMessage = async (message: string) => {
    if(credentials === null){return}
    const roomApi = RoomParticipationApiFactory(
      {accessToken: credentials.access_token!}, credentials.homeserver!)
    const txnId = uuidv4()
    await roomApi.sendMessage(post.room_name, 'm.room.message', txnId, {
      msgtype: "m.text",
      body: `> <${post.chupacabra_source}> ${post.title}\n\n${message}`,
      format: 'org.matrix.custom.html',
      formatted_body: `<mx-reply><blockquote><a href="https://matrix.to/#/${post.room_name}/${post.id}">In reply to</a> <a href="https://matrix.to/#/${post.chupacabra_source}">${post.chupacabra_source}</a><br>${post.title}</blockquote></mx-reply>${message}`,
      'm.relates_to': {
        'm.in_reply_to': {
          event_id: post.id
        }
      }
    }).catch(res => res)
  }
  return sendMessage
}
