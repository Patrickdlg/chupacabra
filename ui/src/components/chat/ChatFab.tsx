import React from 'react';
import {IonFab, IonFabButton, IonIcon } from '@ionic/react'
import {useSetRecoilState} from 'recoil'
import {chatModalState} from '../../recoil/chat'
import { chatbubble } from 'ionicons/icons'

const ChatFab: React.FC = () => {
  const openModal = useSetRecoilState(chatModalState)
  return (
    <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={()=>openModal(true)}>
            <IonIcon icon={chatbubble} />
          </IonFabButton>
    </IonFab>
  );
};

export default ChatFab;
