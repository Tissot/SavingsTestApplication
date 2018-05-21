'use strict'

import React from 'react'
import {
  TouchableOpacity,
  Text,
  StyleSheet
} from 'react-native'

import PropTypes from 'prop-types'

import { mainColor } from '../libs/Styles'

export default function CustomButton (props) {
  return (
    <TouchableOpacity
      activeOpacity={props.activeOpacity}
      style={[
        styles.button,
        {
          backgroundColor: props.backgroundColor,
          height: props.height
        }
      ]}
      onPress={props.onPress}
    >
      <Text style={[
        styles.buttonText,
        props.width === 'auto' ? { flex: 1 } : { width: props.width }
      ]}>
        {props.text}
      </Text>
    </TouchableOpacity>
  )
}

CustomButton.propTypes = {
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  height: PropTypes.number,
  activeOpacity: PropTypes.number,
  onPress: PropTypes.func,
  backgroundColor: PropTypes.string,
  text: PropTypes.string.isRequired
}

CustomButton.defaultProps = {
  width: 'auto',
  height: 40,
  activeOpacity: .8,
  backgroundColor: mainColor
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 2
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center'
  }
})
