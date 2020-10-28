import React from 'react'
import {useRecoilValue} from 'recoil'
import {postList} from '../../recoil/feed'
import {IonGrid, IonRow} from '@ionic/react'
import PostItem from './PostItem'

const PostList: React.FC = () => {
  const posts = useRecoilValue(postList)
  return (
    <IonGrid>
      <IonRow>
        {posts.map(postId => <PostItem key={postId} postId={postId}/>)}
      </IonRow>
    </IonGrid>
  )
}

export default PostList
