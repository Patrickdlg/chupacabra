import {selectorFamily} from 'recoil'
import {loadMedia} from '../matrix/Media'

export const postMediaSelector = selectorFamily<string, string>({
  key: "PostMedia",
  get: mediaUri => async () => {
    const media = await loadMedia(mediaUri)
    return media
  }
})
