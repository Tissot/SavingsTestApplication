'use strict'

import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet
} from 'react-native'

import PropTypes from 'prop-types'

export default class SectionHeaderComponent extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <View style={[
        { height: this.$verticalSpacingDistance },
        this.props.sectionHeaderText && { justifyContent: 'center' }
      ]}>
      {
        this.props.sectionHeaderText && <Text style={styles.sectionHeader}>{this.props.sectionHeaderText}</Text>
      }
      </View>
    )
  }
}

SectionHeaderComponent.propType = {
  sectionHeaderText: PropTypes.string
}

const styles = StyleSheet.create({
  sectionHeader: {
    marginLeft: 24,
    color: '#8f8f8f'
  }
})
