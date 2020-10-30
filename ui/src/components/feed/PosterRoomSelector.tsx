import React, {Suspense} from 'react'
import {useRecoilValue, useRecoilState} from 'recoil'
import {IonItem, IonLabel, IonSelect, IonSelectOption} from '@ionic/react'
import {followedRoomsState, roomState} from '../../recoil/rooms'
import {chupaPosterRoom} from '../../recoil/post'
import './PosterRoomSelector.css'

const customAlertOptions = {
  header: 'Share Post',
  subHeader: 'Select Room',
  translucent: true,
  cssClass: 'room-alert'
}

interface RoomSelectItemProps{
  room_id: string
}

const RoomSelectItem: React.FC<RoomSelectItemProps> = ({room_id}) => {
  const room = useRecoilValue(roomState(room_id))
  return <IonSelectOption value={room.id}>{room.name}</IonSelectOption>
}

const PosterRoomSelector: React.FC = () => {
  const followed_rooms = useRecoilValue(followedRoomsState)
  const [poster_room, setPosterRoom] = useRecoilState(chupaPosterRoom)
  return (
    <IonItem color="background">
      <IonLabel position="stacked">Room</IonLabel>
      <IonSelect interface='alert' onIonChange={e => setPosterRoom(e.detail.value)} value={poster_room} interfaceOptions={customAlertOptions} placeholder="Select a room">
        {Array.from(followed_rooms).map(room_id =>
          <Suspense key={room_id} fallback={<IonSelectOption key={room_id} value={room_id}>{room_id}</IonSelectOption>}>
            <RoomSelectItem key={room_id} room_id={room_id} />
          </Suspense>
        )}
      </IonSelect>
    </IonItem>
  );
};

export default PosterRoomSelector
