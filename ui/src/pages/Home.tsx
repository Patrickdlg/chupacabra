import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonIcon} from '@ionic/react'
import React from 'react'
import {Helmet} from "react-helmet"
import PostList from '../components/feed/PostList'
import SyncLoader from '../components/feed/SyncLoader'
import FollowModal from '../components/feed/FollowModal'
import FollowButton from '../components/feed/FollowButton'
import NotFollowing from '../components/feed/NotFollowing'
import './Home.css';

const Home: React.FC = () => {
  return (
    <>
      <Helmet>
        <title> Feed | Chupacabra </title>
      </Helmet>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <FollowButton />
            <IonTitle>Feed <IonIcon className="feed-icon" size="large" src="/assets/icon/feed.svg" /></IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle>Feed <IonIcon className="feed-icon" size="large" src="/assets/icon/feed.svg" /></IonTitle>
            </IonToolbar>
          </IonHeader>
          <SyncLoader />
          <NotFollowing />
          <PostList />
        </IonContent>
        <FollowModal/>
      </IonPage>
    </>
  );
};

export default Home;
