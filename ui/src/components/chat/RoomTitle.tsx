import React, {Suspense} from 'react'
import {IonTitle} from '@ionic/react'
import {useRecoilValue} from 'recoil'
import {usePostFromUrl} from '../../recoil/feed'
import {roomState} from '../../recoil/rooms'

const FriendlyTitle: React.FC = () => {
  const post = usePostFromUrl()
  const room = useRecoilValue(roomState(post.room_name))
  return (
    <IonTitle>{room.name}</IonTitle>
  )
}

const RoomTitle: React.FC = () => {
  const post = usePostFromUrl()
  return (
    <Suspense fallback={<IonTitle>{post.room_name}</IonTitle>}>
      <FriendlyTitle />
    </Suspense>

  )
}

export default RoomTitle
