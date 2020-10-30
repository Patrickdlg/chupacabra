import React from 'react'
import {useRecoilValue, useRecoilState} from 'recoil'
import {IonInput, IonButton, IonCard, IonCardContent, IonCardTitle,
        IonCardHeader, IonItem, IonLabel, IonSpinner} from '@ionic/react'
import {useCreatePost} from '../../matrix/Post'
import {postSendingState, chupaPosterUri, chupaPosterTitle} from '../../recoil/post'
import PosterRoomSelector from './PosterRoomSelector'
import './ChupaPoster.css'

const ChupaPoster: React.FC = () => {
  const [title, setTitle] = useRecoilState(chupaPosterTitle)
  const [uri, setUri] = useRecoilState(chupaPosterUri)
  const createPost = useCreatePost()
  const isPostSending = useRecoilValue(postSendingState)
  return (
    <IonCard className='post-composer-card'>
      <IonCardHeader>
        <IonCardTitle>Post to Chupacabra</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonItem color="background">
          <IonLabel position="stacked">Title</IonLabel>
          <IonInput type="text" value={title} placeholder="Enter Title" onIonChange={e => setTitle(e.detail.value!)} />
        </IonItem>
        <IonItem color="background">
          <IonLabel position="stacked">Share Url</IonLabel>
          <IonInput type="url" value={uri} placeholder="Enter Url" onIonChange={e => setUri(e.detail.value!)} />
        </IonItem>
        <PosterRoomSelector />
        <IonButton disabled={isPostSending} fill="outline" color="primary" className="post-composer-button" onClick={createPost}>
          Post {isPostSending && <IonSpinner />}
        </IonButton>
      </IonCardContent>
    </IonCard>
  );
};

export default ChupaPoster
