import axios from 'axios'
import {useSetRecoilState} from 'recoil'
import {loggedInState} from '../recoil/auth'
import {PostType} from '../recoil/feed'
import {VALIDATE_STATUS, MATRIX_CREDS_STORAGE_KEY, CLIENT_API_PATH} from './Config'
import { v4 as uuidv4 } from 'uuid'
import {Plugins} from '@capacitor/core'

const {Storage} = Plugins

const getCredsOrLogout = async (letIn: (shouldLetIn: boolean) => void) => {
  const res = await Storage.get({key: MATRIX_CREDS_STORAGE_KEY})
  const creds = JSON.parse(res.value!)
  if(!creds){ // log out if we've called this without credentials
    letIn(false)
    return null
  }
  return creds
}

export const useSendMessage = (post: PostType) => {
  const letIn = useSetRecoilState(loggedInState)
  const sendMessage = async (message: string) => {
    const creds = await getCredsOrLogout(letIn)
    if(!creds){return}
    const base_url = `${creds.homeserver_url}${CLIENT_API_PATH}`
    const authHeader = {Authorization: `Bearer ${creds.access_token}`}
    const txnId = uuidv4()
    await axios({
      method: 'put',
      url:`${base_url}/rooms/${post.room_name}/send/m.room.message/${txnId}`,
      headers: authHeader,
      data: {
        msgtype: "m.text",
        body: `> <${post.chupacabra_source}> ${post.title}\n\n${message}`,
        format: 'org.matrix.custom.html',
        formatted_body: `<mx-reply><blockquote><a href="https://matrix.to/#/${post.room_name}/${post.id}">In reply to</a> <a href="https://matrix.to/#/${post.chupacabra_source}">${post.chupacabra_source}</a><br>${post.title}</blockquote></mx-reply>${message}`,
        'm.relates_to': {
          'm.in_reply_to': {
            event_id: post.id
          }
        }
      },
      validateStatus: VALIDATE_STATUS
    }).catch(err => console.log(err))
  }
  return sendMessage
}
