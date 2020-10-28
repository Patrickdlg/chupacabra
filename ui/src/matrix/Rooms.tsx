import axios from 'axios'
import {VALIDATE_STATUS, MATRIX_CREDS_STORAGE_KEY,
        CLIENT_API_PATH} from './Config'
import {RoomType} from '../recoil/rooms'
import {Plugins} from '@capacitor/core'

const {Storage} = Plugins

export const getJoinedRooms = async() => {
  const creds_string = await Storage.get({key: MATRIX_CREDS_STORAGE_KEY})
  const creds = JSON.parse(creds_string.value!)
  if(!creds){return new Array<RoomType>()}
  const base_url = `${creds.homeserver_url}${CLIENT_API_PATH}`
  const authHeader = {Authorization: `Bearer ${creds.access_token}`}
  const room_id_result = await axios({
    method: 'get',
    url:`${base_url}/joined_rooms`,
    headers: authHeader,
    validateStatus: VALIDATE_STATUS
  }).catch(err => err)
  const room_ids: Array<string> = (room_id_result.data && room_id_result.data.joined_rooms)
    ? room_id_result.data.joined_rooms
    : new Array<string>()
  const room_states: Array<RoomType> = await Promise.all(room_ids.map(room_id => {
    return axios({
      method: 'get',
      url:`${base_url}/rooms/${room_id}/state/m.room.name`,
      headers: authHeader,
      validateStatus: VALIDATE_STATUS
    }).then(res=>{return {id: room_id, name: res.data.name! || 'Empty'}}).catch(err =>{return {id: room_id, name: 'Empty'}})
  }))
  return room_states
}
