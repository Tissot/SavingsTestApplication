'use strict'

import React, { Component } from 'react'
import {
  SectionList,
  View,
  Alert
} from 'react-native'

import ImagePicker from 'react-native-image-crop-picker'
import { NavigationActions } from 'react-navigation'

import ListItem from '../components/ListItem.js'
import ItemSeparatorComponent from '../components/ItemSeparatorComponent.js'
import CustomButton from '../components/CustomButton.js'

export default class PersonalSettings extends Component {
  constructor (props) {
    super(props)
    this.state = {
      refreshing: false,
      personalSettings: []
    }
  }

  componentWillMount () {
    this.getUserInfo()
  }
  
  render () {
    return (
      <View style={{
        flex: 1,
        backgroundColor: this.$sreenBackgroundColor
      }}>
        <SectionList
          sections={this.state.personalSettings}
          keyExtractor={(item) => item.key}
          renderItem={({item}) => {
            return (
              <ListItem
                itemKey={item.key}
                valueType={item.key === '头像' ? 'image' : 'text'}
                itemValue={item.value}
                onPress={async () => {
                  if (item.key === '头像') {
                    try {
                      const image = await ImagePicker.openPicker({
                        width: 300,
                        height: 300,
                        cropping: true,
                        includeBase64: true,
                        mediaType: 'photo'
                      })

                      let data = new FormData()
                      data.append('avatar', image.data)

                      const response = (await this.$formDataAjax({
                        method: 'post',
                        url: '/user/editAvatar',
                        data
                      })).data

                      if (response.statusCode === 100) {
                        this.getUserInfo()
                      }

                      Alert.alert('修改头像', response.message, [
                        {
                          text: '确认'
                        }
                      ])
                    } catch (error) {
                    }
                  } else if (item.key === '昵称') {
                    this.props.navigation.navigate('EditInfo', {
                      title: item.key,
                      defaultValue: item.value,
                      refreshFunction: () => {
                        this.getUserInfo()
                      }
                    })
                  } else if (item.key === '密码') {
                    this.props.navigation.navigate('EditInfo', {
                      title: '手机验证码',
                      buttonText: '下一步'
                    })
                  }
                }}
              />
            )
          }}
          renderSectionHeader={() => (
            <View style={{ height: this.$verticalSpacingDistance }}></View>
          )}
          ItemSeparatorComponent={ItemSeparatorComponent}
          ListFooterComponent={() => (
            <View style={{
              paddingTop: this.$verticalSpacingDistance,
              paddingBottom: this.$verticalSpacingDistance,
              paddingLeft: this.$horizontalSpacingDistance,
              paddingRight: this.$horizontalSpacingDistance
            }}>
              {
                this.state.personalSettings.length > 0 && <CustomButton
                  backgroundColor='red'
                  onPress={() => this.signOut()}
                  text='退出登录'
                />
              }
            </View>
          )}
          refreshing={this.state.refreshing}
          onRefresh={() => this.getUserInfo()}
        />
      </View>
    )
  }

  async getUserInfo () {
    this.setState((prevState, props) => ({
      refreshing: true
    }))

    const response = (await this.$JSONAjax({
      method: 'post',
      url: '/user/getUserInfo'
    })).data

    if (response.statusCode === 100) {
      const { avatar, nickname } = response.result

      this.setState((prevState, props) => ({
        personalSettings: [
          {
            key: '0',
            data: [
              {
                key: '头像',
                value: avatar
              }
            ]
          },
          {
            key: '1',
            data: [
              {
                key: '昵称',
                value: nickname
              }
            ]
          },
          {
            key: '2',
            data: [
              {
                key: '密码',
                value: '********'
              }
            ]
          }
        ]
      }))

      this.props.navigation.state.params.refreshFunction(avatar, nickname)
    }

    this.setState((prevState, props) => ({
      refreshing: false
    }))
  }

  async handleSignOutResponse (response) {
    await Promise.all([
      this.$storage.remove({
        key: 'token'
      }), this.$storage.remove({
        key: 'eachMonthActualSavings'
      })
    ])

    this.$JSONAjax.defaults.headers.common['token'] = ''

    this.props.navigation.dispatch(NavigationActions.reset({
      index: 0,
      actions: [ NavigationActions.navigate({ routeName: 'SignIn'}) ]
    }))
  }

  async signOut () {
    const response = (await this.$JSONAjax({
      method: 'post',
      url: 'user/signOut'
    })).data

    Alert.alert('登出', response.message, [
      {
        text: '确认',
        onPress: () => this.handleSignOutResponse(response)
      }
    ], {
      onDismiss: () => this.handleSignOutResponse(response)
    })
  }
}
