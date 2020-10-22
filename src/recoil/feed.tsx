import { selectorFamily, selector, atom} from 'recoil'

export type PostType = {
  chupacabra_source: string,
  remote_source: string,
  title: string,
  html: string
}

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
      remote_source: '',
      title: '',
      html: ''
    }
    return post
  }
})

export const postList = selector<Array<string>>({
  key: "PostList",
  get: ({get}) => {
    const postMap = get(postsState)
    return Array.from(postMap.keys())
  }
})

export const syncState = atom<boolean>({
  key: "SyncState",
  default: false
})
