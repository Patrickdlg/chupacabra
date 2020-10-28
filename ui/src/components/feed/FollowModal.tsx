import React, {Suspense} from 'react';
import {IonModal, IonHeader, IonToolbar, IonButtons, IonContent, IonButton, IonTitle, IonSpinner} from '@ionic/react'
import {useRecoilState} from 'recoil'
import {followModalState} from '../../recoil/feed'
import FollowMenu from './FollowMenu'

const FollowModal: React.FC = () => {
  const [isOpen, setOpen] = useRecoilState(followModalState)
  return (
    <IonModal isOpen={isOpen} onDidDismiss={()=>setOpen(false)}>
      <IonHeader>
        <IonToolbar>
            <IonButtons slot="end">
              <IonButton color='primary' fill='outline' onClick={()=>setOpen(false)}>Close</IonButton>
            </IonButtons>
          <IonTitle>Follow</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <Suspense fallback={<IonSpinner />}>
        <FollowMenu />
        </Suspense>
      </IonContent>
    </IonModal>
  );
};

export default FollowModal;
