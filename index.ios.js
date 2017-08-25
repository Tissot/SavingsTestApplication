'use strict'

import React, { Component } from 'react'

import {
  AppRegistry,
  Text,
  StyleSheet
} from 'react-native'

export default class SavingsTestApplication extends Component {
  render () {
    return (
      <Text>RN</Text>
    )
  }
}

const styles = StyleSheet.create({
})

AppRegistry.registerComponent('SavingsTestApplication', () => SavingsTestApplication)
