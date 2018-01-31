'use strict'

import React, { Component } from 'react'
import {
  View,
  StatusBar,
  FlatList,
  Linking
} from 'react-native'

import ListItem from '../components/ListItem.js'
import ItemSeparatorComponent from '../components/ItemSeparatorComponent.js'
import CustomButton from '../components/CustomButton.js'

export default class OnlineLearning extends Component {
  constructor (props) {
    super(props)

    /* 
      onlineContents: array<
        object<
          _id: string,
          title: string,
          type: number,
          url: string
        >
      > 
    */
    this.state = {
      refreshing: false,
      onlineContents: []
    }
  }

  componentWillMount () {
    this.getOnlineContents()
  }

  render () {
    return (
      <View style={{
        flex: 1,
        backgroundColor: this.$screenBackgroundColor
      }}>
        <StatusBar
          animated={true}
          barStyle='light-content'
          backgroundColor={this.$OS === 'android' ? this.$mainColor : undefined} // android
        />
        <FlatList
          data={this.state.onlineContents}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <ListItem
              onPress={() => {
                if (item.type === 0) {
                  this.props.navigation.navigate('OnlineContent', { title: item.title, url: item.url })
                } else if (item.type === 1) {
                  Linking.openURL(item.url)
                }
              }}
              itemIcon={item.type === 0 && require('../assets/icons/Document.png') || item.type === 1 && require('../assets/icons/Video.png') || undefined}
              iconSize={36}
              marginRight={112}
              itemKey={item.title}
              listItemKeyLines={5}
            />
          )}
          ItemSeparatorComponent={ItemSeparatorComponent}
          ListFooterComponent={this.state.onlineContents.length > 0 ? () => (
            <View style={{
              paddingTop: this.$verticalSpacingDistance,
              paddingBottom: this.$verticalSpacingDistance,
              paddingLeft: this.$horizontalSpacingDistance,
              paddingRight: this.$horizontalSpacingDistance
            }}>
              <CustomButton
                onPress={() => this.props.navigation.navigate('OnlineTest')}
                text='开始测验'
              />
            </View>
          ) : undefined}
          refreshing={this.state.refreshing}
          onRefresh={() => this.getOnlineContents()}
        />
      </View>
    )
  }

  shouldComponentUpdate (newProps, newState) {
    if (this.state.refreshing !== newState.refreshing) {
      return true
    }

    if (this.state.onlineContents.length !== newState.onlineContents.length) {
      return true
    } else {
      for (let i = 0; i < this.state.onlineContents.length; ++i) {
        if (this.state.onlineContents[i]._id !== newState.onlineContents[i]._id) {
          return true
        }
      }

      return false
    }
  }

  getOnlineContents () {
    this.setState({ refreshing: true }, async () => {
      const response = (await this.$JSONAjax({
        method: 'post',
        url: '/onlineContent/getOnlineContents'
      })).data
  
      if (response.statusCode === 100) {
        this.setState({ onlineContents: response.result.onlineContents })
      }

      this.setState({ refreshing: false })
    })
  }
}
