import React from 'react';
import {IonList} from '@ionic/react'
import MessageItem from './MessageItem'
import {useRecoilValue} from 'recoil'
import {postMessagesSelector, MessageType} from '../../recoil/chat'
import {usePostFromUrl} from '../../recoil/feed'
import './MessageList.css'

const MessageList: React.FC = () => {
  const post = usePostFromUrl()
  const messages: Array<MessageType> = useRecoilValue(postMessagesSelector(post))
  return (
    <IonList className="message-list">
      {messages.map(msg => <MessageItem key={msg.id} message={msg}/>)}
    </IonList>
  );
};

export default MessageList;
