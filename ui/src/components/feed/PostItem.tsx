import React, {Suspense} from 'react'
import {useRecoilValue} from 'recoil'
import {postState, PostType} from '../../recoil/feed'
import {roomState} from '../../recoil/rooms'
import {IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonText,
        IonCardContent, IonSkeletonText, IonCol, IonSpinner} from '@ionic/react'
import './PostItem.css'

const timeSince = (ts: number) => {
  var seconds = Math.floor((Date.now() - ts) / 1000)
  var interval = seconds / 31536000
  if (interval > 1) {
    return Math.floor(interval) + " years"
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months"
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days"
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours"
  }
  interval = seconds / 60
  if (interval > 1) {
    return Math.floor(interval) + " minutes"
  }
  return Math.floor(seconds) + " seconds"
}

interface PostItemProps {
  postId: string
}

interface RoomPartProps{
  room_name: string
}

interface PendingPostProps{
  post: PostType
}

const RoomPart: React.FC<RoomPartProps> = ({room_name}) => {
  const room = useRecoilValue(roomState(room_name))
  return (
    <>
      <IonText className='room-name'>{room.name}</IonText>
    </>
  )
}

const PendingPost: React.FC<PendingPostProps> = ({post}) => (
  <IonCard className='post-card' button disabled>
      <IonCardHeader>
        <IonCardSubtitle>
          <IonText className='room-name'>Fetching... <IonSpinner /></IonText>
        </IonCardSubtitle>
        <IonCardTitle className='post-title'>{post.title}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonText className='shared-text'>
          {post.chupacabra_source} shared <br/> {timeSince(post.server_ts)} ago
        </IonText>
      </IonCardContent>
  </IonCard>
)

const PostItem: React.FC<PostItemProps> = ({postId}) => {
  const post:PostType = useRecoilValue(postState(postId))
  return (
    <IonCol size="12" sizeMd="6" sizeLg="4" sizeXl="4">
     {post.pending
       ?  <PendingPost post={post} />
       :  <IonCard className='post-card' button routerLink={`posts/${postId}`} routerDirection="forward">
           <IonCardHeader>
             <IonCardSubtitle>
               <Suspense fallback={<IonText className='room-name'> <IonSkeletonText /> </IonText>}>
                     <RoomPart room_name={post.room_name} />
               </Suspense>
             </IonCardSubtitle>
             <IonCardTitle className='post-title'>{post.title}</IonCardTitle>
           </IonCardHeader>
           <IonCardContent>
             <IonText className='shared-text'>
               {post.chupacabra_source} shared <br/> {timeSince(post.server_ts)} ago
             </IonText>
           </IonCardContent>
          </IonCard>
     }

    </IonCol>
  )
}

export default PostItem
