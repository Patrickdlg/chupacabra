import axios from 'axios'
import {VALIDATE_STATUS, MATRIX_CREDS_STORAGE_KEY, MEDIA_API_PATH} from './Config'
import {Plugins} from '@capacitor/core'

const {Storage} = Plugins

export const loadMedia = async (uri: string) => {
  const res = await Storage.get({key: MATRIX_CREDS_STORAGE_KEY})
  const creds = JSON.parse(res.value!)
  if(!creds){return}
  const base_url = `${creds.homeserver_url}${MEDIA_API_PATH}`
  const server_media = uri.substring(6)
  const content = await axios({
    method: 'get',
    url:`${base_url}/download/${server_media}`,
    validateStatus: VALIDATE_STATUS
  }).catch(err => err)
  return content.data
}
