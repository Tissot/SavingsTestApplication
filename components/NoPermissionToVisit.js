'use strict'

import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet
} from 'react-native'

import PropTypes from 'prop-types'

import CustomButton from './CustomButton.js'

export default class NoPermissionToVisit extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <View style={styles.noPermissionToVisit}>
        <Text style={styles.tip}>完成在线学习并通过在线测试方可查看{this.props.module}</Text>
        <CustomButton
          onPress={() => this.props.navigate('OnlineLearning')}
          text='开始学习'
        />
      </View>
    )
  }
}

NoPermissionToVisit.propType = {
  module: PropTypes.string,
  navigate: PropTypes.func
}

const styles = StyleSheet.create({
  noPermissionToVisit: {
    paddingTop: Component.prototype.$verticalSpacingDistance,
    paddingBottom: Component.prototype.$verticalSpacingDistance,
    paddingLeft: Component.prototype.$horizontalSpacingDistance,
    paddingRight: Component.prototype.$horizontalSpacingDistance
  },
  tip: {
    marginBottom: Component.prototype.$verticalSpacingDistance,
    fontSize: 16,
    lineHeight: 28,
    textAlign: 'center'
  }
})
