import { IonList, IonItem, IonInput, IonText, IonLabel, IonButton} from '@ionic/react';
import React, { useState } from 'react';
import {useRecoilValue} from 'recoil'
import {loginErrorState} from '../../recoil/auth'
import {useLoginWithPassword} from '../../matrix/Auth'

const validURL = (url: string) => {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(url);
}


const SignInPage: React.FC = () => {
  const [homeserver, setHomeserver] = useState<string>('https://');
  const [user, setUser] = useState<string>();
  const [password, setPassword] = useState<string>()
  const loginError = useRecoilValue(loginErrorState)
  const loginWithPassword = useLoginWithPassword()
  const isDisabled = !validURL(homeserver!) || !user || !password
  const handleClick = () => loginWithPassword(homeserver!, user!, password!)
  return (
    <>
      <IonList lines="inset">
        <IonItem>
          <IonLabel position="stacked">Homeserver<IonText color="danger">*</IonText></IonLabel>
          <IonInput type="url" value={homeserver} placeholder="https://matrix.org" onIonChange={e => setHomeserver(e.detail.value!)}></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">User<IonText color="danger">*</IonText></IonLabel>
          <IonInput type="text" value={user} placeholder="username" onIonChange={e => setUser(e.detail.value!)}></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Password<IonText color="danger">*</IonText></IonLabel>
          <IonInput type="password" value={password} onIonChange={e => setPassword(e.detail.value!)}></IonInput>
        </IonItem>
      </IonList>
      {loginError && <IonText color='danger'>{loginError}</IonText>}
      <IonButton disabled={isDisabled} expand="block" onClick={handleClick}>Sign In</IonButton>
    </>
  );
};

export default SignInPage
