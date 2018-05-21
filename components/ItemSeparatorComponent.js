'use strict'

import React from 'react'
import {
  View,
  StyleSheet
} from 'react-native'

export default function ItemSeparatorComponent () {
  return (
    <View style={styles.itemSeparatorContainer}>
      <View style={styles.itemSeparator}></View>
    </View>
  )
}

const styles = StyleSheet.create({
  itemSeparatorContainer: {
    backgroundColor: '#fff'
  },
  itemSeparator: {
    borderBottomWidth: 1,
    borderBottomColor: '#cecece',
    marginLeft: 12,
    marginRight: 12
  }
})
