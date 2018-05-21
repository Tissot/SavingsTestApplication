'use strict'

import { PureComponent } from 'react'

import ReactNativeStorage from 'react-native-storage'
import { AsyncStorage } from 'react-native'

import Axios from './Axios.js'

const Storage = new ReactNativeStorage({
  storageBackend: AsyncStorage,
  defaultExpires: null,
  sync: {
    async eachMonthActualSavings ({ resolve, reject }) {
      const response = (await Axios({
        method: 'post',
        url: '/savingsSituation/getEachMonthSavingsSituations'
      })).data

      if (response.statusCode === 100) {
        resolve(response.result.eachMonthSavingsSituations[3])
      } else {
        reject(response.message)
      }
    }
  }
})

// 在每个 React Native 组件中注入 $storage 对象。
PureComponent.prototype.$storage = Storage

export default Storage
