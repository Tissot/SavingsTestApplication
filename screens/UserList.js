'use strict'

import React, { Component } from 'react'

import {
  View,
  FlatList
} from 'react-native'

import ListItem from '../components/ListItem.js'
import ItemSeparatorComponent from '../components/ItemSeparatorComponent.js'
import CustomButton from '../components/CustomButton.js'

export default class UserList extends Component {
  constructor (props) {
    super(props)

    /*
      users: array <
        object <
          _id: string,
          avatar: string,
          nickname: string
        >
      >
    */
    this.state = {
      refreshing: false,
      startNum: 0,
      users: [] 
    }
  }

  componentWillMount () {
    this.refresh()
  }

  render () {
    return (
      <View style={{
        flex: 1,
        backgroundColor: this.$screenBackgroundColor
      }}>
        <FlatList
          data={this.state.users}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <ListItem
              onPress={() => this.props.navigation.navigate('SavingsSituations', { title: item.nickname, userId: item._id })}
              itemIcon={item.avatar}
              iconSize={36}
              marginRight={112}
              itemKey={item.nickname}
            />
          )}
          ItemSeparatorComponent={ItemSeparatorComponent}
          ListFooterComponent={this.state.users.length !== 0 ? () => (
            <View style={{
              paddingTop: this.$verticalSpacingDistance,
              paddingBottom: this.$verticalSpacingDistance,
              paddingLeft: this.$horizontalSpacingDistance,
              paddingRight: this.$horizontalSpacingDistance
            }}>
                <CustomButton
                  onPress={() => this.getUsers()}
                  text='加载更多'
                />
            </View>
          ) : undefined}
          refreshing={this.state.refreshing}
          onRefresh={() => this.refresh()}
        />
      </View>
    )
  }

  shouldComponentUpdate (newProps, newState) {
    if (this.state.refreshing !== newState.refreshing) {
      return true
    }

    if (this.state.users.length !== newState.users.length) {
      return true
    } else {
      for (let i = 0; i < this.state.users.length; ++i) {
        if (this.state.users[i]._id !== newState.users[i]._id) {
          return true
        }
      }
      
      return false
    }
  }

  async getUsers () {
    const response = (await this.$JSONAjax({
      method: 'post',
      url: '/user/getUsers',
      data: {
        group: 4,
        startNum: this.state.startNum * 20,
        pageSize: 20
      }
    })).data

    if (response.statusCode === 100 && response.result.users.length !== 0) {
      this.setState((prevState, props) => ({
        startNum: prevState.startNum + 1,
        users: prevState.users.concat(response.result.users)
      }))
    }
  }

  async refresh () {
    // 此处如果不用 async await ，就算 setState() 用了函数形式，state 仍然不会立即更新。
    await this.setState((prevState, props) => ({
      refreshing: true,
      startNum: 0,
      users: []
    }))

    await this.getUsers()

    this.setState((prevState, props) => ({
      refreshing: false
    }))
  }
}
