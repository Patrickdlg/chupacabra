import {useSetRecoilState} from 'recoil'
import { loginErrorState, credentialsState } from '../recoil/matrix/Auth'
import {SessionManagementApiFactory, InlineObject16TypeEnum} from './client/index'

export const useLoginWithPassword = () => {
  const setLoginError = useSetRecoilState(loginErrorState)
  const setCredentials = useSetRecoilState(credentialsState)
  const loginWithPassword = async (homeserver: string, user_id: string, password: string) => {
    setLoginError('')
    const smApi = SessionManagementApiFactory({}, homeserver)
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
    if(res.data.access_token){
      setCredentials({
        username: user_id,
        homeserver: homeserver,
        access_token: res.data.access_token
      })
    }
  }
  return loginWithPassword
}
