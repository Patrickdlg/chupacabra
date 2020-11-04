import { atom } from 'recoil'
import {localStorageEffect} from '../AtomEffects'

export type MatrixCredentials = {
  homeserver: string | null,
  username: string | null,
  access_token: string | null
}

export const loginErrorState = atom<string>({
  key: 'MX_LoginError',
  default: '',
})

export const credentialsState = atom<MatrixCredentials | null>({
  key: 'MX_Credentials',
  default: null,
  effects_UNSTABLE: [
    localStorageEffect('MX_Credentials')
  ]
})
