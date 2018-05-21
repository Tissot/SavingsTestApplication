'use strict'

import React, { PureComponent } from 'react'
import {
  View,
  Image,
  Alert
} from 'react-native'

import I18n from './i18n'

import {
  StackNavigator,
  TabNavigator,
  TabBarBottom
} from 'react-navigation'

import './libs/Axios.js'
import './libs/Platform.js'
import './libs/Storage.js'
import './libs/Styles.js'

import {
  EditInfo,
  Messages,
  OnlineContent,
  OnlineLearning,
  OnlineTest,
  PersonalCenter,
  PersonalSettings,
  SavingsSituations,
  SavingsSituationsTypes,
  SignIn,
  SystemNotification,
  UserList
} from './screens'

const standardNavigationOptions = {
  headerStyle: {
    backgroundColor: PureComponent.prototype.$mainColor,
  },
  headerTitleStyle: {
    fontSize: 18
  },
  headerBackTitle: null,
  headerTintColor: '#fff',
  gesturesEnabled: true
}

const iconStyle = {
  width: 28,
  height: 28
}

const User = TabNavigator({
  OnlineLearning: {
    screen: OnlineLearning,
    navigationOptions: () =>  ({
      title: I18n.t('onlineLearning.title'),
      tabBarIcon: ({ tintColor }) => (
        <Image
          source={require('./assets/icons/OnlineLearning.png')}
          style={{
            tintColor,
            ...iconStyle
          }}
        />
      )
    })
  },
  SavingsSituationsTypes: {
    screen: SavingsSituationsTypes,
    navigationOptions: () => ({
      title: I18n.t('savingsSituationsTypes.title'),
      tabBarIcon: ({ tintColor }) => (
        <Image
          source={require('./assets/icons/SavingsSituations.png')}
          style={{
            tintColor,
            ...iconStyle
          }}
        />
      )
    })
  },
  Messages: {
    screen: Messages,
    navigationOptions: ({ screenProps }) => ({
      title: I18n.t('messages.title'),
      tabBarIcon: ({ tintColor }) => (
        <Image
          source={require('./assets/icons/Messages.png')}
          style={{
            position: 'relative',
            tintColor,
            ...iconStyle
          }}
        >
          {
            screenProps.hasNewMessages === true &&
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
      )
    })
  },
  PersonalCenter: {
    screen: PersonalCenter,
    navigationOptions: () => ({
      title: I18n.t('personalCenter.title'),
      tabBarIcon: ({ tintColor }) => (
        <Image
          source={require('./assets/icons/PersonalCenter.png')}
          style={{
            tintColor,
            ...iconStyle
          }}
        />
      )
    })
  }
}, {
  tabBarComponent: TabBarBottom,
  tabBarPosition: 'bottom',
  swipeEnabled: true,
  animationEnabled: true,
  lazy: true,
  tabBarOptions: {
    backBehavior: 'none',
    activeTintColor: PureComponent.prototype.$mainColor,
    inactiveTintColor: '#8f8f8f',
    style: {
      backgroundColor: '#fff'
    },
    labelStyle: {
      fontSize: 12
    }
  }
})

const App = StackNavigator({
  SignIn: {
    screen: SignIn,
    navigationOptions: {
      header: null
    }
  },
  User: {
    screen: User,
    navigationOptions: standardNavigationOptions
  },
  OnlineContent: {
    screen: OnlineContent,
    navigationOptions: ({ navigation }) => ({
      title: navigation.state.params.title,
      ...standardNavigationOptions
    })
  },
  OnlineTest: {
    screen: OnlineTest,
    navigationOptions: () => ({
      title: I18n.t('onlineTest.title'),
      ...standardNavigationOptions
    })
  },
  SavingsSituations: {
    screen: SavingsSituations,
    navigationOptions: ({ navigation }) => ({
      title: navigation.state.params.title,
      ...standardNavigationOptions
    })
  },
  UserList: {
    screen: UserList,
    navigationOptions: ({ navigation }) => ({
      title: navigation.state.params.title,
      ...standardNavigationOptions
    })
  },
  SystemNotification: {
    screen: SystemNotification,
    navigationOptions: ({ navigation }) => ({
      title: navigation.state.params.title,
      ...standardNavigationOptions
    })
  },
  PersonalSettings: {
    screen: PersonalSettings,
    navigationOptions: {
      title: '个人设置',
      ...standardNavigationOptions
    }
  },
  EditInfo: {
    screen: EditInfo,
    navigationOptions: ({ navigation }) => ({
      title: navigation.state.params.title,
      ...standardNavigationOptions
    })
  }
}, {
  headerMode: 'float'
})

export default class SavingsTestApplication extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      hasNewMessages: false,
      hasPassedTheExam: false
    }
  }

  async componentDidMount () {
    try {
      const locale = await this.$storage.load({
        key: 'locale',
        autoSync: false,
        syncInBackground: false
      })

      if (locale) {
        this.$i18n.locale = locale
        this.forceUpdate()
      }
    } catch (err) {
    }
  }

  render () {
    const { locale, hasNewMessages, hasPassedTheExam } = this.state;

    return (
      <App
        screenProps={{
          locale,
          hasNewMessages,
          hasPassedTheExam,
          toggleLocale: () => this.forceUpdate(),
          checkHasNewMessages: () => this.checkHasNewMessages(),
          getHasPassedTheExam: () => this.getHasPassedTheExam()
        }}
      />
    )
  }

  async checkHasNewMessages () {
    const response = (await this.$JSONAjax({
      method: 'post',
      url: '/message/hasNewMessages'
    })).data
    
    this.setState({ hasNewMessages: response.result.hasNewMessages })
  }

  async getHasPassedTheExam () {
    const response = (await this.$JSONAjax({
      method: 'post',
      url: '/user/hasPassedTheExam'
    })).data
    
    const { hasPassedTheExam } = response.result

    this.setState({ hasPassedTheExam })
  }
}
