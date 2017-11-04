'use strict'

import React, { Component } from 'react'
import {
  WebView,
  StyleSheet
} from 'react-native'

export default class OnlineContent extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <WebView
        source={{ uri: this.props.navigation.state.params.url }}
        style={styles.OnlineContent}
      />
    )
  }
}

const styles = StyleSheet.create({
  OnlineContent: {
    flex: 1
  }
})
