'use strict'

import React from 'react'
import {
  View,
  Text,
  StyleSheet
} from 'react-native'

import PropTypes from 'prop-types'

import { verticalSpacingDistance } from '../libs/Styles'

export default function SectionHeaderComponent (props) {
  return (
    <View style={[
      { height: verticalSpacingDistance },
      props.sectionHeaderText && { justifyContent: 'center' }
    ]}>
    {
      props.sectionHeaderText && <Text style={styles.sectionHeader}>{props.sectionHeaderText}</Text>
    }
    </View>
  )
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
