'use strict'

import React, { PureComponent } from 'react'
import {
  SectionList,
  View,
  Alert
} from 'react-native'

import ImagePicker from 'react-native-image-crop-picker'
import { NavigationActions } from 'react-navigation'

import {
  ListItem,
  ItemSeparatorComponent,
  CustomButton
} from '../components'

export default class PersonalSettings extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      refreshing: false,
      personalSettings: [
        {
          key: '0',
          data: [
            {
              key: this.$i18n.t('personalSettings.avatar'),
              value: 'https://mardan.top/avatar/female.jpeg'
            }
          ]
        },
        {
          key: '1',
          data: [
            {
              key: this.$i18n.t('personalSettings.nickname'),
              value: 'null'
            }
          ]
        },
        {
          key: '2',
          data: [
            {
              key: this.$i18n.t('password'),
              value: '********'
            }
          ]
        }
      ]
    }
  }

  componentDidMount () {
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
                valueType={item.key === this.$i18n.t('personalSettings.avatar') ? 'image' : 'text'}
                itemValue={item.value}
                onPress={async () => {
                  if (item.key === this.$i18n.t('personalSettings.avatar')) {
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
                        Alert.alert(
                          this.$i18n.t('editInfo.submitResult'),
                          this.$i18n.t('editInfo.submitSuccessfully'),
                          [{ text: this.$i18n.t('alert.confirm') }]
                        )
                      } else if (response.statusCode === 101) {
                        Alert.alert(
                          this.$i18n.t('editInfo.submitResult'),
                          this.$i18n.t('editInfo.failedToSubmit'),
                          [{ text: this.$i18n.t('alert.confirm') }]
                        )
                      }
                    } catch (error) {
                    }
                  } else if (item.key === this.$i18n.t('personalSettings.nickname')) {
                    this.props.navigation.navigate('EditInfo', {
                      title: item.key,
                      defaultValue: item.value,
                      refreshFunction: () => {
                        this.getUserInfo()
                      }
                    })
                  } else if (item.key === this.$i18n.t('password')) {
                    this.props.navigation.navigate('EditInfo', {
                      title: this.$i18n.t('editInfo.verificationCode'),
                      buttonText: this.$i18n.t('editInfo.next')
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
          ListFooterComponent={this.state.personalSettings.length > 0 ? () => (
            <View style={{
              paddingTop: this.$verticalSpacingDistance,
              paddingBottom: this.$verticalSpacingDistance,
              paddingLeft: this.$horizontalSpacingDistance,
              paddingRight: this.$horizontalSpacingDistance
            }}>
              <CustomButton
                backgroundColor='red'
                onPress={() => this.signOut()}
                text={this.$i18n.t('personalSettings.signOut')}
              />
            </View>
          ) : undefined}
          refreshing={this.state.refreshing}
          onRefresh={() => this.getUserInfo()}
        />
      </View>
    )
  }

  getUserInfo () {
    this.setState({ refreshing: true }, async () => {
      const response = (await this.$JSONAjax({
        method: 'post',
        url: '/user/getUserInfo'
      })).data
  
      if (response.statusCode === 100) {
        const { avatar, nickname } = response.result
  
        this.setState({
          personalSettings: [
            {
              key: '0',
              data: [
                {
                  key: this.$i18n.t('personalSettings.avatar'),
                  value: avatar
                }
              ]
            },
            {
              key: '1',
              data: [
                {
                  key: this.$i18n.t('personalSettings.nickname'),
                  value: nickname
                }
              ]
            },
            {
              key: '2',
              data: [
                {
                  key: this.$i18n.t('password'),
                  value: '********'
                }
              ]
            }
          ]
        })
  
        this.props.navigation.state.params.refreshFunction({ avatar, nickname })
      }
  
      this.setState({ refreshing: false })
    })
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

    Alert.alert(
      this.$i18n.t('personalSettings.signOut'),
      response.statusCode === 100 
      ? this.$i18n.t('personalSettings.signOutSuccessfully')
      : this.$i18n.t('userHasBeenDeleted'),
      [
        {
          text: this.$i18n.t('alert.confirm'),
          onPress: () => this.handleSignOutResponse(response)
        }
      ],
      { onDismiss: () => this.handleSignOutResponse(response) }
    )
  }
}
