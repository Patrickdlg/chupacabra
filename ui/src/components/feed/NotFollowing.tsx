import React from 'react'
import {useRecoilValue, useSetRecoilState} from 'recoil'
import {followedRoomsState} from '../../recoil/rooms'
import {followModalState} from '../../recoil/feed'
import {IonItem, IonButton} from '@ionic/react'

const NotFollowing: React.FC = () => {
  const followed_rooms = useRecoilValue(followedRoomsState)
  const setOpen = useSetRecoilState(followModalState)
  return (
    <>
        {!followed_rooms.size && (
          <IonItem color="background" lines="none">
            You're feed isn't subscribed to any rooms.
              <IonButton fill="clear" color="primary" onClick={()=>setOpen(true)}>
                Start Following
              </IonButton>
          </IonItem>
        )}
    </>
  )
}

export default NotFollowing
