import React from 'react';
import {IonButtons, IonButton} from '@ionic/react'
import {useSetRecoilState} from 'recoil'
import {followModalState} from '../../recoil/feed'

const FollowButton: React.FC = () => {
  const setOpen = useSetRecoilState(followModalState)
  return (
    <IonButtons slot='end'>
      <IonButton fill="outline" color="primary" onClick={() => setOpen(true)}>
        Rooms
      </IonButton>
    </IonButtons>
  );
};

export default FollowButton;
