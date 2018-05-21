'use strict'

import React from 'react'
import {
  WebView,
  StyleSheet
} from 'react-native'

export default function OnlineContent (props) {
  return (
    <WebView
      source={{ uri: props.navigation.state.params.url }}
      style={styles.OnlineContent}
    />
  )
}

const styles = StyleSheet.create({
  OnlineContent: {
    flex: 1
  }
})
