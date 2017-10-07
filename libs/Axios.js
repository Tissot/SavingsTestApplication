'use strict'

import { Component } from 'react'
import Axios from 'axios'

Axios.defaults.baseURL = '../API'

// 在每个 React Native 组件中注入 $Axios 方法。
Component.prototype.$Axios = Axios

export default Axios
