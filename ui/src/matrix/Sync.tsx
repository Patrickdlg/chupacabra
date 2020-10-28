import axios from 'axios'
import {useSetRecoilState} from 'recoil'
import {postsState, syncState, PostType} from '../recoil/feed'
import {messagesState, MessageType} from '../recoil/chat'
import {followedRoomsState} from '../recoil/rooms'
import {VALIDATE_STATUS, MATRIX_CREDS_STORAGE_KEY,
        CLIENT_API_PATH, MATRIX_SYNC_KEY, CHUPA_POST_KEY,
        CHUPA_MESSAGE_KEY} from './Config'
import {Plugins} from '@capacitor/core'

const {Storage} = Plugins

const loadFromStorage = async(setPosts: any, setMessages: any, setSynced: any, setFollowedRooms: any) => {
  const matrix_sync_key = (await Storage.get({key: MATRIX_SYNC_KEY})).value!
  if(!matrix_sync_key){return}
  const storage_keys: Array<string> = (await Storage.keys()).keys!
  const post_keys = storage_keys.filter(k => k.startsWith(CHUPA_POST_KEY))
  const message_keys = storage_keys.filter(k => k.startsWith(CHUPA_MESSAGE_KEY))
  const cachedPosts = new Array<PostType>()
  for(let i = 0, len = post_keys.length; i < len; i++){
    const post_key = post_keys[i]
    const stored = await Storage.get({key: post_key})
    const post = JSON.parse(stored.value!)
    if(post){cachedPosts.push(post)}
  }
  setPosts((posts: any) =>{
    var clone = new Map(posts)
    cachedPosts.map(p => clone.set(p.id, p))
    return clone
  })
  setSynced(true)
  const cachedMessages = new Array<MessageType>()
  for(let i = 0, len = message_keys.length; i < len; i++){
    const message_key = message_keys[i]
    const stored = await Storage.get({key: message_key})
    const message = JSON.parse(stored.value!)
    if(message){cachedMessages.push(message)}
  }
  setMessages((messages: any) =>{
    var clone = new Map(messages)
    cachedMessages.map(m => clone.set(m.id, m))
    return clone
  })
  const creds_string = await Storage.get({key: MATRIX_CREDS_STORAGE_KEY})
  const creds = JSON.parse(creds_string.value!)
  if(!creds){return}
  const base_url = `${creds.homeserver_url}${CLIENT_API_PATH}`
  const authHeader = {Authorization: `Bearer ${creds.access_token}`}
  const user_id = creds.user_id
  const sync_key = (await Storage.get({key: MATRIX_SYNC_KEY})).value!
  if(!sync_key){
    return
  }
  const filter_string = await Storage.get({key: sync_key})
  const filter_obj = JSON.parse(filter_string.value!)
  const res = await axios({
    method: 'get',
    url:`${base_url}/user/${user_id}/filter/${filter_obj.filter_id}`,
    headers: authHeader,
    validateStatus: VALIDATE_STATUS
  }).catch(err => err)
  res.data && res.data.room && res.data.room.rooms && setFollowedRooms(new Set<string>(res.data.room.rooms))
}

const syncForever = async(setPosts: any, setMessages: any, setSynced: any, setFollowedRooms: any) => {
  await loadFromStorage(setPosts, setMessages, setSynced, setFollowedRooms)
  while(true){
    const creds_string = await Storage.get({key: MATRIX_CREDS_STORAGE_KEY})
    const creds = JSON.parse(creds_string.value!)
    if(!creds){
      console.error('Tried to sync with no creds!')
    }
    const base_url = `${creds.homeserver_url}${CLIENT_API_PATH}`
    const authHeader = {Authorization: `Bearer ${creds.access_token}`}
    const sync_key = (await Storage.get({key: MATRIX_SYNC_KEY})).value!
    if(!sync_key){
      await new Promise(resolve => setTimeout(resolve, 1000))
      continue
    }
    const filter_string = await Storage.get({key: sync_key})

    const filter_obj = JSON.parse(filter_string.value!)
    if(!filter_obj){
      await new Promise(resolve => setTimeout(resolve, 1000))
      continue
    }
    const {filter_id, since} = filter_obj
    const res = await axios({
      method: 'get',
      url: `${base_url}/sync?filter=${filter_id}&set_presence=offline&timeout=10000` +  (since && `&since=${since}`),
      headers: authHeader,
      validateStatus: VALIDATE_STATUS
    }).catch(err => err)
    if(res.data && res.data.rooms && res.data.rooms.join){
      const rooms = Object.keys(res.data.rooms.join)
      const room_events: Array<any> = rooms
        .map((room: string) => {
          var events = res.data.rooms.join[room]
          events.room_name = room
          return events
        })
        .filter(e=>e.timeline)
        .flatMap(e=>{
         var events = e.timeline.events
         events.map((ev:any) => ev.room_name = e.room_name)
         return events
        })
      const updatePosts = async () => {
        const newPosts: Array<PostType> = room_events
          .filter(e=>e.content.msgtype==='m.chupacabra')
          .map((p:any) => {return {
            chupacabra_source: p.sender,
            title: p.content.body,
            uri: p.content.uri,
            room_name: p.room_name,
            id: p.event_id,
            server_ts: p.origin_server_ts
          }})
        if(newPosts){
          newPosts.forEach(async (p) => {
            await Storage.set({
                key:`${CHUPA_POST_KEY}${p.id}`,
                value: JSON.stringify(p)
              })
            return null
          })
          setPosts((posts: any) =>{
            var clone = new Map(posts)
            newPosts.map(p => clone.set(p.id, p))
            return clone
          })
        }
        setSynced(true)
      }
      const updateMessages = async () => {
        const newMessages: Array<MessageType> = room_events
          .filter((m: any) =>
            m.content && m.content['m.relates_to']
            && m.content['m.relates_to']['m.in_reply_to']
            && m.content['m.relates_to']['m.in_reply_to'].event_id)
          .map((m:any) => { return {
            sender: m.sender,
            id: m.event_id,
            body: m.content.body,
            formatted_body: m.content.formatted_body,
            post_id: m.content['m.relates_to']['m.in_reply_to'].event_id,
            server_ts: m.origin_server_ts,
            room_name: m.room_name
          }})
        if (newMessages){
          newMessages.forEach(async (m) => {
            await Storage.set({
                key:`${CHUPA_MESSAGE_KEY}${m.id}`,
                value: JSON.stringify(m)
              })
            return null
          })
          setMessages((messages: any) =>{
            var clone = new Map(messages)
            newMessages.map((m: any) => {
              clone.set(m.id, m)
              return m
            })
            return clone
          })
        }
      }
      updatePosts()
      updateMessages()
    }
    if(!res.data || !res.data.next_batch){
      console.log(`Sync Request Returned No Batch: ${JSON.stringify(res)}`)
      await new Promise(resolve => setTimeout(resolve, 1000))
      continue
    }
    await Storage.set({key: sync_key, value: JSON.stringify({filter_id: filter_id, since: res.data.next_batch})})
  }
}

export const useSyncMatrix = () => {
  const setPosts = useSetRecoilState(postsState)
  const setMessages = useSetRecoilState(messagesState)
  const setSynced = useSetRecoilState(syncState)
  const setFollowedRooms = useSetRecoilState(followedRoomsState)
  return () => syncForever(setPosts, setMessages, setSynced, setFollowedRooms)
}
