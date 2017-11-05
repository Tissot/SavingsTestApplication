'use strict'

import React, { Component } from 'react'
import {
  TouchableHighlight,
  View,
  Image,
  Text,
  StyleSheet
} from 'react-native'

import PropTypes from 'prop-types'

export default class CustomListItem extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <TouchableHighlight underlayColor={this.$listUnderColor} onPress={this.props.onPress}>
        <View style={[
          styles.listItemContainer,
          this.props.itemValue !== undefined && { justifyContent: 'space-between' }
        ]}>
          <View style={styles.listItemIconKeyContainer}>
            {
              this.props.itemIcon !== undefined && <Image
                source={typeof this.props.itemIcon === 'number' && this.props.itemIcon
                || typeof this.props.itemIcon === 'string' && {uri: this.props.itemIcon}}
                style={{
                  marginLeft: 20,
                  width: this.props.iconSize,
                  height: this.props.iconSize
                }}
              />
            }
            <View style={{
              marginLeft: this.props.itemIcon === undefined ? 20 : 12,
              marginRight: this.props.itemValue === undefined ? this.props.marginRight : 20,
              minHeight: this.props.iconSize,
              justifyContent: 'center'
            }}>
              <Text numberOfLines={this.props.listItemKeyLines} style={styles.listItemKey}>{this.props.itemKey}</Text>
            </View>
          </View>
          {
            this.props.itemValue !== undefined && (this.props.valueType === 'text' && <View style={{
              justifyContent: 'center',
              marginRight: this.props.marginRight
            }}>
              <Text style={styles.listItemValue}>{this.props.itemValue}</Text>
            </View> || this.props.valueType === 'image' && <Image
              source={{ uri: this.props.itemValue }}
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
}

CustomListItem.propTypes = {
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

CustomListItem.defaultProps = {
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
