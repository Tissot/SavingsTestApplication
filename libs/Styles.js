'use strict'

import { PureComponent } from 'react'

// 在每个 React Native 组件中注入 $mainColor（主题色）常量。
export const mainColor = '#00bfff'
PureComponent.prototype.$mainColor = mainColor

// 在每个 React Native 组件中注入 $screenBackgroundColor（屏幕背景色）常量。
export const screenBackgroundColor = '#f4f4f4'
PureComponent.prototype.$screenBackgroundColor = screenBackgroundColor

// 在每个 React Native 组件中注入 $listUnderColor（列表点击变色）常量。
export const listUnderColor = '#e0e0e0'
PureComponent.prototype.$listUnderColor = listUnderColor

// 在每个 React Native 组件中注入 $verticalSpacingDistance（水平间隔距离）常量。
export const verticalSpacingDistance = 24
PureComponent.prototype.$verticalSpacingDistance = verticalSpacingDistance

// 在每个 React Native 组件中注入 $horizontalSpacingDistance（垂直间隔距离）常量。
export const horizontalSpacingDistance = 16
PureComponent.prototype.$horizontalSpacingDistance = horizontalSpacingDistance
