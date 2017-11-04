'use strict'

import React, { Component } from 'react'
import {
  TouchableHighlight,
  View,
  Image,
  Text
} from 'react-native'

import PropTypes from 'prop-types'

export default class MessageItem extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <TouchableHighlight underlayColor={this.$listUnderColor} onPress={this.props.onPress}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingTop: 12,
          paddingBottom: 12,
          paddingLeft: 20,
          paddingRight: 20,
          backgroundColor: '#fff'
        }}>
          <Image
            source={this.props.type === 0 && require('../assets/icons/SystemMessage.png')
            || this.props.type === 1 && { uri: this.props.avatar }}
            style={{
              position: 'relative',
              width: 40,
              height: 40
            }}
          >
            {
              this.props.read === false &&
              <View style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: 8,
                height: 8,
                backgroundColor: 'red',
                borderRadius: 4
              }}></View>
            }
          </Image>
          <View style={{
            flex: 1,
            marginLeft: 12
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Text style={{
                color: '#000',
                fontSize: 16
              }}>{this.props.type === 0 && '系统通知'
                || this.props.type === 1 && this.props.nickname}
              </Text>
              <Text style={{
                color: '#8f8f8f'
              }}>{this.props.date}</Text>
            </View>
            <Text style={{
              color: '#8f8f8f'
            }} numberOfLines={this.props.type === 0 && 1 || undefined}>{this.props.content}</Text>
          </View>
        </View>
      </TouchableHighlight>
    )
  }
  
}

MessageItem.propTypes = {
  type: PropTypes.oneOf([0, 1]).isRequired,
  avatar: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  nickname: PropTypes.string,
  date: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  read: PropTypes.bool.isRequired,
  onPress: PropTypes.func.isRequired
}
