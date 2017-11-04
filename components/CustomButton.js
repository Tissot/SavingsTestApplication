'use strict'

import React, { Component } from 'react'
import {
  TouchableOpacity,
  Text,
  StyleSheet
} from 'react-native'

import PropTypes from 'prop-types'

export default class CustomButton extends Component {
  render () {
    return (
      <TouchableOpacity
      activeOpacity={this.props.activeOpacity}
      style={[
        styles.button,
        {
          backgroundColor: this.props.backgroundColor,
          height: this.props.height
        }
      ]}
      onPress={this.props.onPress}
    >
      <Text style={[
        styles.buttonText,
        this.props.width === 'auto' ? { flex: 1 } : { width: this.props.width }
      ]}>
        {this.props.text}
      </Text>
    </TouchableOpacity>
    )
  }
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
  backgroundColor: Component.prototype.$mainColor
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
