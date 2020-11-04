import React, {Suspense} from 'react';
import { useRecoilValue } from 'recoil'
import { credentialsState } from '../recoil/matrix/Auth'
import {joinedRoomsState} from '../recoil/rooms'
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
  console.log('RENDERED LOGGEDIN COMPONENT')
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
  const credentials = useRecoilValue(credentialsState)
  const wasLetIn = credentials
  return wasLetIn? <LoggedInMatrixScripts /> : null
}

export default MatrixScripts;
