'use strict'

import { Component } from 'react'

// 在每个 React Native 组件中注入 $mainColor（主题色）常量。
Component.prototype.$mainColor = '#00bfff'

// 在每个 React Native 组件中注入 $screenBackgroundColor（屏幕背景色）常量。
Component.prototype.$screenBackgroundColor = '#f4f4f4'

// 在每个 React Native 组件中注入 $listUnderColor（列表点击变色）常量。
Component.prototype.$listUnderColor = '#e0e0e0'
