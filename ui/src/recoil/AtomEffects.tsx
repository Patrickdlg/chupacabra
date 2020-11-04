import {AtomEffect, DefaultValue} from 'recoil'
import {Plugins} from '@capacitor/core'

const {Storage} = Plugins

export function localStorageEffect<T>(key: string): AtomEffect<T>{
  return ({setSelf, onSet}) => {
    Storage.get({key: key}).then(res => {
      if(res.value != null){
        setSelf(JSON.parse(res.value))
      }
    })
    onSet(newValue => {
      if (newValue instanceof DefaultValue) {
        Storage.remove({key: key});
      } else {
        Storage.set({key: key, value: JSON.stringify(newValue)})
      }
    })
  }
}
