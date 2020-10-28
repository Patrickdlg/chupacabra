import { atomFamily } from 'recoil'

type SourceType = {
  name: string
}

export const sourceState = atomFamily<SourceType, string>({
  key: 'SourceType',
  default: name => {return {name: name}},
})
