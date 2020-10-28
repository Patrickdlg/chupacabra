import React from 'react';
import {IonModal, IonHeader, IonToolbar, IonButtons, IonContent, IonButton} from '@ionic/react'
import {useRecoilState} from 'recoil'
import {chatModalState} from '../../recoil/chat'
import MessageList from './MessageList'
import MessageComposer from './MessageComposer'
import RoomTitle from './RoomTitle'

const ChatModal: React.FC = () => {
  const [isOpen, setOpen] = useRecoilState(chatModalState)
  return (
    <IonModal isOpen={isOpen} onDidDismiss={()=>setOpen(false)}>
      <IonHeader>
        <IonToolbar>
            <IonButtons slot="end">
              <IonButton color='primary' fill='outline' onClick={()=>setOpen(false)}>Close</IonButton>
            </IonButtons>
          <RoomTitle />
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <MessageList />
      </IonContent>
      <MessageComposer />
    </IonModal>
  );
};

export default ChatModal;
