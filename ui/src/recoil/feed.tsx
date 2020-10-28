import { selectorFamily, selector, atom, useRecoilValue} from 'recoil'
import {useParams} from 'react-router-dom'

export type PostType = {
  chupacabra_source: string,
  title: string,
  uri: string,
  room_name: string,
  id: string,
  server_ts: number
}

export const followModalState = atom<boolean>({
  key: "FollowModalOpen",
  default: false
})

export const postsState = atom<Map<string, PostType>>({
  key: 'PostMap',
  default: new Map<string, PostType>()
})

export const postState = selectorFamily<PostType, string>({
  key: 'Post',
  get: (postId) => ({get}) => {
    const postsMap = get(postsState)
    const post: PostType = postsMap.get(postId) || {
      chupacabra_source: '',
      title: '',
      uri: '',
      room_name: '',
      id: '',
      server_ts: 0
    }
    return post
  }
})

export const usePostFromUrl = () => {
  const {postId} = useParams()
  const post = useRecoilValue(postState(postId))
  return post
}

export const postList = selector<Array<string>>({
  key: "PostList",
  get: ({get}) => {
    const postMap = get(postsState)
    const posts = Array.from(postMap.values())
    posts.sort((a: PostType, b: PostType) => b.server_ts-a.server_ts)
    return posts.map(p => p.id)
  }
})

export const syncState = atom<boolean>({
  key: "SyncState",
  default: true
})
