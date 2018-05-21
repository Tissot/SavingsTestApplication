'use strict'

import React from 'react'
import {
  TouchableHighlight,
  View,
  Image,
  Text,
  StyleSheet
} from 'react-native'

import PropTypes from 'prop-types'

import { listUnderColor } from '../libs/Styles'

export default function ListItem (props) {
  return (
    <TouchableHighlight underlayColor={listUnderColor} onPress={props.onPress}>
      <View style={[
        styles.listItemContainer,
        props.itemValue !== undefined && { justifyContent: 'space-between' }
      ]}>
        <View style={styles.listItemIconKeyContainer}>
          {
            props.itemIcon !== undefined && <Image
              source={typeof props.itemIcon === 'number' && props.itemIcon
              || typeof props.itemIcon === 'string' && {uri: props.itemIcon}}
              style={{
                marginLeft: 20,
                width: props.iconSize,
                height: props.iconSize
              }}
            />
          }
          <View style={{
            marginLeft: props.itemIcon === undefined ? 20 : 12,
            marginRight: props.itemValue === undefined ? props.marginRight : 20,
            minHeight: props.iconSize,
            justifyContent: 'center'
          }}>
            <Text numberOfLines={props.listItemKeyLines} style={styles.listItemKey}>{props.itemKey}</Text>
          </View>
        </View>
        {
          props.itemValue !== undefined && (props.valueType === 'text' && <View style={{
            justifyContent: 'center',
            marginRight: props.marginRight
          }}>
            <Text style={styles.listItemValue}>{props.itemValue}</Text>
          </View> || props.valueType === 'image' && <Image
            source={{ uri: props.itemValue }}
            style={{
              marginRight: 20,
              width: 52,
              height: 52
            }}
          />)
        }
      </View>
    </TouchableHighlight>
  )
}

ListItem.propTypes = {
  onPress: PropTypes.func,
  itemIcon: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  // 如果手机上用flex: 1可以解决就不用 marginRight，否则就用 measure 测行数结合 marginRight 这个等到真机的时候才知道。
  marginRight: PropTypes.number,
  itemKey: PropTypes.string.isRequired,
  valueType: PropTypes.oneOf(['text','image']),
  itemValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])
}

ListItem.defaultProps = {
  marginRight: 0,
  iconSize: 24,
  valueType: 'text'
}

const styles = StyleSheet.create({
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#fff'
  },
  listItemIconKeyContainer: {
    flexDirection: 'row'
  },
  listItemKey: {
    color: '#000',
    fontSize: 16
  },
  listItemValue: {
    marginRight: 20,
    textAlign: 'right',
    color: '#8f8f8f'
  }
})
