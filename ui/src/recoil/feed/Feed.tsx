import { atom, selector } from 'recoil'
import {postState} from '../post/Post'
import {localStorageEffect} from '../AtomEffects'
import {notNull} from '../../utils/Utils'

export const followModalState = atom<boolean>({
  key: "FollowModalOpen",
  default: false
})

export const postIdsState = atom<Array<string>>({
  key: 'Chupacabra_Post_Ids',
  default: new Array<string>(),
  effects_UNSTABLE: [
    localStorageEffect('Chupacabra_Post_Ids')
  ]
})

export const feedPostIds = selector<Array<string>>({
  key: 'ChupacabraFeedIds',
  get: ({get}) => {
    const ids = get(postIdsState)
    const posts = ids.map(id => get(postState(id))).filter(notNull)
    posts.sort((a, b) => b.server_ts-a.server_ts)
    return posts.map(post => post.id)
  }
})
