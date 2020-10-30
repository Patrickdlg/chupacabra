import {atom} from 'recoil'

export const chupaPosterTitle = atom<string>({
  key: 'ChupaPosterTitle',
  default: ''
})

export const chupaPosterUri = atom<string>({
  key: 'ChupaPosterUri',
  default: ''
})

export const chupaPosterRoom = atom<string>({
  key: "ChupaPosterRoom",
  default: ''
})

export const postSendingState = atom<boolean>({
  key: 'IsSendingPost',
  default: false
})
