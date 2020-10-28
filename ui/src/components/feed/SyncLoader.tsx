import React from 'react'
import {useRecoilValue} from 'recoil'
import {syncState} from '../../recoil/feed'
import {IonSpinner, IonItem} from '@ionic/react'

const SyncLoader: React.FC = () => {
  const isSynced = useRecoilValue(syncState)
  return (
    <IonItem color="background" lines="none">
      {!isSynced && <IonSpinner />}
    </IonItem>
  )
}

export default SyncLoader
