import React from 'react';
import {IonList, IonItem, IonLabel, IonCheckbox, IonNote} from '@ionic/react'
import {useRecoilValue} from 'recoil'
import {followedRoomsState, joinedRoomsState, RoomType} from '../../recoil/rooms'
import {useSetFilter} from '../../matrix/Filter'
import './FollowMenu.css'

const FollowModal: React.FC = () => {
  const followed_rooms = useRecoilValue(followedRoomsState)
  const joinedRooms: Array<RoomType> = useRecoilValue(joinedRoomsState)
  const setFollowedRooms = useSetFilter()
  const handleChange = (room: RoomType, isChecked: boolean) => {
    const clone = new Set<string>(followed_rooms)
    isChecked? clone.add(room.id) : clone.delete(room.id)
    setFollowedRooms(clone)
  }
  return (
    <IonList>
      {joinedRooms.map(r =>
        <IonItem key={r.id}>
          <div className="room-text">
            <IonLabel className="room-name">{r.name}</IonLabel>
            <IonNote className="room-id">{r.id.split(':')[1]}</IonNote>
          </div>
          <IonCheckbox slot='end' value={r.id} checked={followed_rooms.has(r.id)}
                       onIonChange={e => handleChange(r, e.detail.checked)} />
        </IonItem>)}
    </IonList>
  );
};

export default FollowModal;
