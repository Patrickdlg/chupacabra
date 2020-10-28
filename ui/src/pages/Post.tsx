import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonToolbar, IonLoading} from '@ionic/react'
import React, {Suspense} from 'react'
import ChatFab from '../components/chat/ChatFab'
import ChatModal from '../components/chat/ChatModal'
import PostTitle from '../components/post/PostTitle'
import PostHelmet from '../components/post/PostHelmet'
import MatrixMedia from '../components/post/MatrixMedia'


const Post: React.FC = () => {
  return (
    <>
      <PostHelmet />
      <IonPage>
        <IonHeader>
          <IonToolbar>
              <IonButtons slot="start">
                <IonBackButton />
              </IonButtons>
            <PostTitle />
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <PostTitle />
            </IonToolbar>
          </IonHeader>
          <Suspense fallback={<IonLoading isOpen={true} message="Loading Media..."/>}>
            <MatrixMedia/>
          </Suspense>
          <ChatFab />
          <ChatModal />
        </IonContent>
      </IonPage>
    </>
  );
};

export default Post;
