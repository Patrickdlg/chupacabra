import axios from 'axios'
import {useSetRecoilState} from 'recoil'
import {loggedInState, loginErrorState} from '../recoil/auth'
import {VALIDATE_STATUS, MATRIX_CREDS_STORAGE_KEY, CLIENT_API_PATH} from './Config'
import {Plugins} from '@capacitor/core'

const {Storage} = Plugins

export const useLoginWithPassword = () => {
  const letIn = useSetRecoilState(loggedInState)
  const setLoginError = useSetRecoilState(loginErrorState)
  const loginWithPassword = async (homeserver: string, user_id: string, password: string) => {
    setLoginError('')
    const base_url = `${homeserver}${CLIENT_API_PATH}`
    const res = await axios({
      method: 'post',
      url: `${base_url}/login`,
      data: {
        type: 'm.login.password',
        identifier: {
          type: 'm.id.user',
          user: user_id
        },
        password: password
      },
      validateStatus: VALIDATE_STATUS
    }).catch(err => err)
    if(res.data.error){
      setLoginError(res.data.error)
      return
    }
    if(res.data.access_token){
      res.data.homeserver_url = homeserver
      await Storage.set({
        key: MATRIX_CREDS_STORAGE_KEY,
        value: JSON.stringify(res.data)
      })
      letIn(true)
    }
  }
  return loginWithPassword
}

export const useLoginWithCreds = () => {
  const letIn = useSetRecoilState(loggedInState)
  const loginWithCreds = async () => {
    const res = await Storage.get({key: MATRIX_CREDS_STORAGE_KEY})
    const creds = JSON.parse(res.value!)
    if (creds){
      letIn(true)
    }
  }
  return loginWithCreds
}
