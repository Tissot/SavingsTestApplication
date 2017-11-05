'use strict'

import { Component } from 'react'
import Axios from 'axios'

Axios.defaults.baseURL = 'https://mardan.top'

// 在每个 React Native 组件中注入 $JSONAjax 方法。
Component.prototype.$JSONAjax = Axios

const formDataAjax = Axios.create({
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})

// 在每个 React Native 组件中注入 $formDataAjax 方法。
Component.prototype.$formDataAjax = formDataAjax

export default Axios
