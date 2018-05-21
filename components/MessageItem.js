'use strict'

import React from 'react'
import {
  TouchableHighlight,
  View,
  Image,
  Text
} from 'react-native'

import PropTypes from 'prop-types'

import { listUnderColor } from '../libs/Styles'
import I18n from '../i18n'

export default function MessageItem (props) {
  return (
    <TouchableHighlight underlayColor={listUnderColor} onPress={props.onPress}>
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
          source={props.type === 0 && require('../assets/icons/SystemMessage.png')
          || props.type === 1 && { uri: props.avatar }}
          style={{
            position: 'relative',
            width: 40,
            height: 40
          }}
        >
          {
            props.read === false &&
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
            }}>
              {
                props.type === 0 && I18n.t('messages.systemNotification')
                || props.type === 1 && props.nickname
              }
            </Text>
            <Text style={{
              color: '#8f8f8f'
            }}>{props.date}</Text>
          </View>
          <Text style={{
            color: '#8f8f8f'
          }} numberOfLines={props.type === 0 && 1 || undefined}>{props.content}</Text>
        </View>
      </View>
    </TouchableHighlight>
  )
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
