import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import React from 'react'
import {Helmet} from "react-helmet"
import LoginForm from '../components/auth/LoginForm'

const Login: React.FC = () => {
  return (
    <>
      <Helmet>
        <title> Let Me In | Chupacabra</title>
      </Helmet>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Let Me In</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle>Let Me In</IonTitle>
            </IonToolbar>
          </IonHeader>
          <LoginForm />
        </IonContent>
      </IonPage>
    </>
  );
};

export default Login;
