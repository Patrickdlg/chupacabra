import React from 'react';
import { useRecoilValue } from 'recoil'
import {credentialsState} from '../recoil/matrix/Auth'
import { Redirect, Route } from 'react-router-dom';
import { IonRouterOutlet} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from '../pages/Home';
import Post from '../pages/Post';
import Login from '../pages/Login';


const AppRouter: React.FC = () => {
  const credentials = useRecoilValue(credentialsState)
  const wasLetIn = credentials
  return (
    <IonReactRouter>
      <IonRouterOutlet>
        <Route path="/feed" component={wasLetIn? Home : Login} exact={true} />
        <Route path="/posts/:postId" component={wasLetIn? Post : Login} />
      </IonRouterOutlet>
      <Route path="/" render={() => <Redirect to='/feed'/>}/>
    </IonReactRouter>
  );
};

export default AppRouter;
