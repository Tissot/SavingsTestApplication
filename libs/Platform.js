'use strict'

import { Component } from 'react'
import { Platform } from 'react-native'

// 在每个 React Native 组件中注入 $OS （操作系统类型）常量。
Component.prototype.$OS = Platform.OS
