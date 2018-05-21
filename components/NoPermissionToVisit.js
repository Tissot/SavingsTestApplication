'use strict'

import React from 'react'
import {
  View,
  Text,
  StyleSheet
} from 'react-native'

import PropTypes from 'prop-types'

import { CustomButton } from './index'
import {
  horizontalSpacingDistance,
  verticalSpacingDistance
} from '../libs/Styles'
import I18n from '../i18n'

export default function NoPermissionToVisit (props) {
  return (
    <View style={styles.noPermissionToVisit}>
      <Text style={styles.tips}>{I18n.t('noPermissionToVisit.tips')}</Text>
      <CustomButton
        onPress={() => props.navigate('OnlineLearning')}
        text={I18n.t('noPermissionToVisit.beginLearning')}
      />
    </View>
  )
}

NoPermissionToVisit.propType = {
  module: PropTypes.string,
  navigate: PropTypes.func
}

const styles = StyleSheet.create({
  noPermissionToVisit: {
    paddingTop: verticalSpacingDistance,
    paddingBottom: verticalSpacingDistance,
    paddingLeft: horizontalSpacingDistance,
    paddingRight: horizontalSpacingDistance
  },
  tips: {
    marginBottom: verticalSpacingDistance,
    fontSize: 16,
    lineHeight: 28,
    textAlign: 'center'
  }
})
