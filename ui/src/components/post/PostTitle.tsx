import React from 'react'
import {IonTitle} from '@ionic/react'
import {usePostFromUrl} from '../../recoil/feed'

const PostTitle: React.FC = () => {
  const post = usePostFromUrl()
  return (
    <IonTitle>{post.title}</IonTitle>
  )
}

export default PostTitle;
