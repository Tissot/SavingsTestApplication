'use strict'

import { Component } from 'react'

import ReactNativeStorage from 'react-native-storage'
import { AsyncStorage } from 'react-native'

const Storage = new ReactNativeStorage({
  storageBackend: AsyncStorage,
  defaultExpires: null
})

// 在每个 React Native 组件中注入 $storage 对象。
Component.prototype.$storage = Storage

export default Storage
