import axios from 'axios'
import {useRecoilState, useRecoilValue} from 'recoil'
import {postSendingState, chupaPosterUri, chupaPosterTitle, chupaPosterRoom} from '../recoil/post'
import {useAddPosts, PostType} from '../recoil/feed'
import {followedRoomsState} from '../recoil/rooms'
import {useSetFilter} from '../matrix/Filter'
import {MATRIX_CREDS_STORAGE_KEY, CLIENT_API_PATH, VALIDATE_STATUS,
        CHUPA_PENDING_POST_PREFIX, CHUPA_BOT, CHUPA_BOT_ROOM_KEY} from './Config'
import { v4 as uuidv4 } from 'uuid'
import {Plugins} from '@capacitor/core'

const {Storage} = Plugins

export const getOrCreateChupaBotRoom = async (base_url: string, authHeader: any) => {
  const chupa_room = (await Storage.get({key: CHUPA_BOT_ROOM_KEY})).value!
  if(chupa_room){return chupa_room}
  const res = await axios({
    method: 'post',
    headers: authHeader,
    url: `${base_url}/createRoom`,
    data: {
        visibility: 'private',
        is_direct: true,
        invite: [CHUPA_BOT]
    },
    validateStatus: VALIDATE_STATUS
  }).catch(err => err)
  if(res.data && res.data.room_id){
    await Storage.set({key: CHUPA_BOT_ROOM_KEY, value: res.data.room_id})
    return res.data.room_id
  }
  console.log('Error getting chupa room: ', res)
  return ''
}

export const useCreatePost = () => {
  const [title, setTitle] = useRecoilState(chupaPosterTitle)
  const [uri, setUri] = useRecoilState(chupaPosterUri)
  const [poster_room, setPosterRoom] = useRecoilState(chupaPosterRoom)
  const [isPostSending, setPostSending] = useRecoilState(postSendingState)
  const followed_rooms = useRecoilValue(followedRoomsState)
  const setFilter = useSetFilter()
  const addPosts = useAddPosts()
  if(isPostSending){
    return () => console.log('Attempted to submit post while one is processing')
  }
  const createPost = async () => {
    setPostSending(true)
    const creds_string = await Storage.get({key: MATRIX_CREDS_STORAGE_KEY})
    const creds = JSON.parse(creds_string.value!)
    if(!creds){return}
    const base_url = `${creds.homeserver_url}${CLIENT_API_PATH}`
    const authHeader = {Authorization: `Bearer ${creds.access_token}`}
    const bot_room = await getOrCreateChupaBotRoom(base_url, authHeader)
    const followed_rooms_clone = new Set<string>(followed_rooms)
    followed_rooms_clone.add(bot_room)
    await setFilter(followed_rooms_clone)
    if(!bot_room){return}
    const txnId = uuidv4()
    await axios({
      method: 'put',
      url:`${base_url}/rooms/${bot_room}/send/m.room.message/${txnId}`,
      headers: authHeader,
      data: {
        msgtype: "m.text",
        body: `!chupabot get ${uri} "${title}"`,
      },
      validateStatus: VALIDATE_STATUS
    }).catch(err => console.log(err))
    setTitle('')
    setUri('')
    // TODO: persist pending posts ???
    const pendingPostId = `${CHUPA_PENDING_POST_PREFIX}${txnId}`
    const newPost: PostType = {
      chupacabra_source: 'you',
      title: title,
      uri: uri,
      room_name: 'PENDING',
      id: pendingPostId,
      server_ts: Date.now(),
      pending: true,
      origin_uri: uri,
      pending_send_room: poster_room
    }
    await addPosts([newPost])
    setPosterRoom('')
    setPostSending(false)
  }
  return createPost
}

export const sendPendingPost = async (post: PostType, room: string) => {
  if(!post){return}
  if(!room){return}
  const creds_string = await Storage.get({key: MATRIX_CREDS_STORAGE_KEY})
  const creds = JSON.parse(creds_string.value!)
  if(!creds){return}
  const base_url = `${creds.homeserver_url}${CLIENT_API_PATH}`
  const authHeader = {Authorization: `Bearer ${creds.access_token}`}
  const txnId = uuidv4()
  await axios({
    method: 'put',
    url:`${base_url}/rooms/${room}/send/m.room.message/${txnId}`,
    headers: authHeader,
    data: {
      msgtype: 'm.chupacabra',
      uri: post.uri,
      body: post.title,
      origin_uri: post.origin_uri
    },
    validateStatus: VALIDATE_STATUS
  }).catch(err => console.log(err))
}
