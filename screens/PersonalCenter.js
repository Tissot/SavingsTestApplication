'use strict'

import React, { PureComponent } from 'react'
import {
  View,
  SectionList,
  Linking
} from 'react-native'

import {
  ListItem,
  ItemSeparatorComponent
} from '../components'

export default class PersonalCenter extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      refreshing: false,

      listItems: [
        {
          key: '0',
          data: [
            {
              avatar: 'https://mardan.top/avatar/female.jpeg',
              nickname: 'null'
            }
          ]
        },
        {
          key: '2',
          data: [
            {
              key: this.$i18n.t('personalCenter.Questionnaire'),
              icon: require('../assets/icons/Questionaire.png'),
              questionnaireURL: ''
            }
          ]
        },
        {
          key: '3',
          data: [
            {
              key: this.$i18n.t('personalCenter.hotline'),
              icon: require('../assets/icons/AdvisoryPhone.png'),
              value: ''
            }
          ]
        },
        {
          key: '4',
          data: [
            {
              key: this.$i18n.t('personalCenter.toggleLocale'),
              icon: require('../assets/icons/Globalization.png'),
              value: this.$i18n.t('locale')
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
                onPress={async () => {
                  if (item.avatar !== undefined && item.nickname !== undefined) {
                    this.props.navigation.navigate('PersonalSettings', {
                      refreshFunction: (userInfo) => this.refreshUserInfo(userInfo)
                    })
                  } else if (item.key === this.$i18n.t('personalCenter.Questionnaire')) {
                    this.props.navigation.navigate('OnlineContent', {
                      title: item.key,
                      url: item.questionnaireURL
                    })
                  } else if (item.key === this.$i18n.t('personalCenter.hotline')) {
                    Linking.openURL(`tel:${item.value}`)
                  } else if (item.key === this.$i18n.t('personalCenter.toggleLocale')) {
                    this.$i18n.locale = this.$i18n.currentLocale() === 'zhHans' ? 'zhHant' : 'zhHans'
                    await this.$storage.save({
                      key: 'locale',
                      data: this.$i18n.locale
                    })
                    this.props.screenProps.toggleLocale()
                    this.refreshUserInfo()
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

  refreshUserInfo (userInfo, questionnaireURL, advisoryPhone) {
    this.setState((prevState, props) => ({
      listItems: [
        {
          key: '0',
          data: [
            {
              avatar: userInfo ? userInfo.avatar : prevState.listItems[0].data[0].avatar,
              nickname: userInfo ? userInfo.nickname : prevState.listItems[0].data[0].nickname
            }
          ]
        },
        {
          key: '2',
          data: [
            {
              key: this.$i18n.t('personalCenter.Questionnaire'),
              icon: require('../assets/icons/Questionaire.png'),
              questionnaireURL: questionnaireURL || prevState.listItems[1].data[0].questionnaireURL
            }
          ]
        },
        {
          key: '3',
          data: [
            {
              key: this.$i18n.t('personalCenter.hotline'),
              icon: require('../assets/icons/AdvisoryPhone.png'),
              value: advisoryPhone || prevState.listItems[2].data[0].value
            }
          ]
        },
        {
          key: '4',
          data: [
            {
              key: this.$i18n.t('personalCenter.toggleLocale'),
              icon: require('../assets/icons/Globalization.png'),
              value: this.$i18n.t('locale')
            }
          ]
        }
      ]
    }))
  }

  getUserInfo () {
    this.setState({ refreshing: true }, async () => {
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
  
      this.setState({ refreshing: false })
    })
  }
}
