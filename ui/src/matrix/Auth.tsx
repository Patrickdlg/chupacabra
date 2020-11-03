import {useSetRecoilState} from 'recoil'
import {loggedInState, loginErrorState, userNameState} from '../recoil/matrix/Auth'
import {SessionManagementApiFactory, InlineObject16TypeEnum} from './client/index'
import {Plugins} from '@capacitor/core'

const {Storage} = Plugins

export const useLoginWithPassword = () => {
  const letIn = useSetRecoilState(loggedInState)
  const setLoginError = useSetRecoilState(loginErrorState)
  const loginWithPassword = async (homeserver: string, user_id: string, password: string) => {
    setLoginError('')
    const options = {}
    const smApi = SessionManagementApiFactory({basePath: homeserver}, homeserver)
    const res = await smApi.login({
      type: InlineObject16TypeEnum.Password,
      identifier: {type: 'm.id.user'},
      user: user_id,
      password: password
    }).catch(err=>err)
    console.log(JSON.stringify(res))
    if(res.data.error){
      setLoginError(res.data.error)
      return
    }
    // if(res.data.access_token){
    //   res.data.homeserver_url = homeserver
    //   await Storage.set({
    //     key: MATRIX_CREDS_STORAGE_KEY,
    //     value: JSON.stringify(res.data)
    //   })
    //   letIn(true)
    // }
  }
  return loginWithPassword
}

export const useLoginWithCreds = () => {
  const letIn = useSetRecoilState(loggedInState)
  const loginWithCreds = async () => {
    // const res = await Storage.get({key: MATRIX_CREDS_STORAGE_KEY})
    // const creds = JSON.parse(res.value!)
    // if (creds){
    //   letIn(true)
    // }
  }
  return loginWithCreds
}
