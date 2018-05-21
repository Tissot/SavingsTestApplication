'use strict'

import { PureComponent } from 'react'
import Axios from 'axios'

Axios.defaults.baseURL = 'https://mardan.top'

// 在每个 React Native 组件中注入 $JSONAjax 方法。
PureComponent.prototype.$JSONAjax = Axios

const formDataAjax = Axios.create({
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})

// 在每个 React Native 组件中注入 $formDataAjax 方法。
PureComponent.prototype.$formDataAjax = formDataAjax

export default Axios
