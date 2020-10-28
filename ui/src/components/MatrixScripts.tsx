import React, {Suspense} from 'react';
import { useRecoilValue } from 'recoil'
import {loggedInState} from '../recoil/auth'
import {joinedRoomsState} from '../recoil/rooms'
import {useLoginWithCreds} from '../matrix/Auth'
import {useSyncMatrix} from '../matrix/Sync'

const RoomLoader: React.FC = () => {
  useRecoilValue(joinedRoomsState)
  return null
}

const SyncScripts: React.FC = () => {
  const syncMatrix = useSyncMatrix()
  syncMatrix()
  return null
}

const LoggedInMatrixScripts: React.FC = () => {
  const syncMatrix = useSyncMatrix()
  console.log('RENDERED LOGGEDIN COMPONENT')
  syncMatrix()
  return (
    <>
      <SyncScripts />
      <Suspense fallback={null}>
        <RoomLoader />
      </Suspense>
    </>
  )
}

const MatrixScripts: React.FC = () => {
  const wasLetIn = useRecoilValue(loggedInState)
  const loginWithCreds = useLoginWithCreds()
  loginWithCreds()
  return wasLetIn? <LoggedInMatrixScripts /> : null
}

export default MatrixScripts;
