import { selectorFamily, selector, atom, useRecoilValue, useSetRecoilState} from 'recoil'
import {useParams} from 'react-router-dom'
import {sendPendingPost} from '../matrix/Post'

export type PostType = {
  chupacabra_source: string,
  title: string,
  uri: string,
  room_name: string,
  id: string,
  server_ts: number,
  pending: boolean,
  pending_send_room: string,
  origin_uri: string
}

export type PendingPostKeyType = {
  title: string,
  uri: string
}

export const followModalState = atom<boolean>({
  key: "FollowModalOpen",
  default: false
})

export const postsState = atom<Map<string, PostType>>({
  key: 'PostMap',
  default: new Map<string, PostType>()
})

export const useAddPosts = () => {
  const setPosts = useSetRecoilState(postsState)
  const addPosts = async (newPosts: Array<PostType>) => {
    const postsToSend = new Array<{post: PostType, room: string}>()
    setPosts((oldMap: Map<string,PostType>)=>{
      const clone = new Map<string, PostType>(oldMap)
      const pendingPostThing: any = {}
      Array.from(clone.values()).filter(post => post.pending).forEach((pending: PostType) => {
        pendingPostThing[pending.title] = pendingPostThing[pending.title] || {}
        pendingPostThing[pending.title][pending.origin_uri] = pendingPostThing[pending.title][pending.origin_uri]
          ? pendingPostThing[pending.title][pending.origin_uri].push(pending.id)
          : [pending.id]
      });
      newPosts.forEach(post => {
        //Only remove pending posts when a corresponding NON-pending post comes in
        if(!post.pending){
          const pendingIds: Array<string> = pendingPostThing[post.title]
            ?  pendingPostThing[post.title][post.origin_uri] || new Array<string>()
            : new Array<string>()
          pendingIds.forEach(id => {
            const pendingPost = clone.get(id)
            pendingPost && postsToSend.push({
              post: post,
              room: pendingPost.pending_send_room
            })
            clone.delete(id)
          })
        }
        clone.set(post.id, post)
      })
      return clone
    })
    await Promise.all(postsToSend.map(item => sendPendingPost(item.post, item.room)))
  }
  return addPosts
}

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
      server_ts: 0,
      pending: false,
      origin_uri: '',
      pending_send_room: ''
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
