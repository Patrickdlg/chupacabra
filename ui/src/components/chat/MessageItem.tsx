import React from 'react';
import {IonText, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle} from '@ionic/react'
import {MessageType} from '../../recoil/chat'
import './MessageItem.css'

interface MessageItemProps {
  message: MessageType
}

const MessageItem: React.FC<MessageItemProps> = ({message}) => {
  const sender = message.sender
  const body_parts = message.formatted_body.split('</mx-reply>')
  const body_message = body_parts[body_parts.length-1]
  return (
      <IonCard className="message-item">
        <IonCardHeader><IonCardSubtitle>{sender}:</IonCardSubtitle></IonCardHeader>
        <IonCardContent><IonText>{body_message}</IonText></IonCardContent>
      </IonCard>
  );
};

export default MessageItem;
