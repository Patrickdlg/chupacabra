import axios from 'axios'
import {VALIDATE_STATUS, MATRIX_CREDS_STORAGE_KEY,
        CLIENT_API_PATH, MATRIX_SYNC_KEY, getRoomFilter} from './Config'
import {useSetRecoilState} from 'recoil'
import {followedRoomsState} from '../recoil/rooms'
import {syncState} from '../recoil/feed'
import { v4 as uuidv4 } from 'uuid'
import {Plugins} from '@capacitor/core'

const {Storage} = Plugins

export const useSetFilter = () => {
  const setFollowedRooms = useSetRecoilState(followedRoomsState)
  const setSynced = useSetRecoilState(syncState)
  const setFilter = async (roomList: Set<string>) => {
    const newSyncKey = uuidv4()
    const oldSyncKey = (await Storage.get({key: MATRIX_SYNC_KEY})).value!
    await Storage.set({key: MATRIX_SYNC_KEY, value: newSyncKey})
    const creds_string = await Storage.get({key: MATRIX_CREDS_STORAGE_KEY})
    const creds = JSON.parse(creds_string.value!)
    if(!creds){return}
    const base_url = `${creds.homeserver_url}${CLIENT_API_PATH}`
    const authHeader = {Authorization: `Bearer ${creds.access_token}`}
    const user_id = creds.user_id
    const res = await axios({
      method: 'post',
      url:`${base_url}/user/${user_id}/filter`,
      headers: authHeader,
      data: getRoomFilter(Array.from(roomList)),
      validateStatus: VALIDATE_STATUS
    }).catch(err => err)
    const filter_obj = {filter_id: res.data.filter_id, since: ''}
    setSynced(false)
    await Storage.set({key: newSyncKey, value: JSON.stringify(filter_obj)})
    setFollowedRooms(roomList)
    oldSyncKey && await Storage.remove({key: oldSyncKey})
  }
  return setFilter
}
