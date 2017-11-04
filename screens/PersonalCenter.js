'use strict'

import React, { Component } from 'react'
import {
  View,
  SectionList,
  Linking
} from 'react-native'

import ListItem from '../components/ListItem.js'
import ItemSeparatorComponent from '../components/ItemSeparatorComponent.js'

export default class PersonalCenter extends Component {
  constructor (props) {
    super(props)
    this.state = {
      refreshing: false,
      listItems: []
    }
  }

  componentWillMount () {
    this.getUserInfo()
  }
  
  render () {
    return (
      <View style={{
        flex: 1,
        backgroundColor: this.$screenBackgroundColor
      }}>
        <SectionList
          sections={this.state.listItems}
          keyExtractor={(item) => item.key}
          renderItem={({item}) => {
            return (
              <ListItem
                itemIcon={item.avatar || item.icon}
                iconSize={item.avatar !== undefined ? 52 : undefined}
                itemKey={item.nickname || item.key}
                itemValue={typeof item.value === 'number' ? String(item.value) : item.value}
                onPress={() => {
                  if (item.avatar !== undefined && item.nickname !== undefined) {
                    this.props.navigation.navigate('PersonalSettings', { refreshFunction: (avatar, nickname) => this.refreshUserInfo({ avatar, nickname }) })
                  } else if (item.key === '积分兑换') {
                  } else if (item.key === '问卷调查') {
                    Linking.openURL(item.questionnaireURL)
                  } else if (item.key === '咨询电话') {
                    Linking.openURL(`tel:${item.value}`)
                  }
                }}
              />
            )
          }}
          renderSectionHeader={() => (
            <View style={{ height: this.$verticalSpacingDistance }}></View>
          )}
          ItemSeparatorComponent={ItemSeparatorComponent}
          refreshing={this.state.refreshing}
          onRefresh={() => this.getUserInfo()}
        />
      </View>
    )
  }

  refreshUserInfo ({ avatar, nickname }, questionnaireURL, advisoryPhone) {
    this.setState((prevState, props) => ({
      listItems: [
        {
          key: '0',
          data: [
            {
              avatar,
              nickname
            }
          ]
        },
        // {
        //   key: '1',
        //   data: [
        //     {
        //       key: '积分兑换',
        //       icon: require('../assets/icons/Points.png'),
        //       value: 1000
        //     }
        //   ]
        // },
        {
          key: '2',
          data: [
            {
              key: '问卷调查',
              icon: require('../assets/icons/Questionaire.png'),
              questionnaireURL: questionnaireURL || prevState.questionnaireURL
            }
          ]
        },
        {
          key: '3',
          data: [
            {
              key: '咨询电话',
              icon: require('../assets/icons/AdvisoryPhone.png'),
              value: advisoryPhone || prevState.advisoryPhone
            }
          ]
        }
      ]
    }))
  }

  async getUserInfo () {
    this.setState((prevState, props) => ({
      refreshing: true
    }))

    const [promise1, promise2, promise3] = await this.$JSONAjax.all([
      this.$JSONAjax({
        method: 'post',
        url: '/user/getUserInfo'
      }), this.$JSONAjax({
        method: 'post',
        url: '/user/getQuestionnaireURL'
      }), this.$JSONAjax({
        method: 'post',
        url: '/user/getAdvisoryPhone'
      })
    ])

    const response1 = promise1.data, response2 = promise2.data, response3 = promise3.data

    if (response1.statusCode === 100 && response2.statusCode === 100 && response3.statusCode === 100) {
      this.refreshUserInfo(response1.result, response2.result.questionnaireURL, response3.result.advisoryPhone)
    }

    this.setState((prevState, props) => ({
      refreshing: false
    }))
  }
}
