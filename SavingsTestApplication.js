'use strict'

import React, { Component } from 'react'
import {
  View,
  Image,
  Alert
} from 'react-native'

import {
  StackNavigator,
  TabNavigator,
  TabBarBottom
} from 'react-navigation'

import './libs/Axios.js'
import './libs/Platform.js'
import './libs/Storage.js'
import './libs/Styles.js'

import OnlineLearning from './screens/OnlineLearning.js'
import OnlineContent from './screens/OnlineContent.js'
import OnlineTest from './screens/OnlineTest.js'
import SavingsSituationsTypes from './screens/SavingsSituationsTypes.js'
import SavingsSituations from './screens/SavingsSituations.js'
import UserList from './screens/UserList.js'
import PersonalSettings from './screens/PersonalSettings.js'
import EditInfo from './screens/EditInfo.js'
import Messages from './screens/Messages.js'
import SystemNotification from './screens/SystemNotification.js'
import PersonalCenter from './screens/PersonalCenter.js'
import SignIn from './screens/SignIn.js'

const standardNavigationOptions = {
  headerStyle: {
    backgroundColor: Component.prototype.$mainColor,
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
    navigationOptions: {
      title: '在线学习',
      tabBarIcon: ({ tintColor }) => (
        <Image
          source={require('./assets/icons/OnlineLearning.png')}
          style={{
            tintColor: tintColor,
            ...iconStyle
          }}
        />
      )
    }
  },
  SavingsSituationsTypes: {
    screen: SavingsSituationsTypes,
    navigationOptions: {
      title: '储蓄情况',
      tabBarIcon: ({ tintColor }) => (
        <Image
          source={require('./assets/icons/SavingsSituations.png')}
          style={{
            tintColor: tintColor,
            ...iconStyle
          }}
        />
      )
    }
  },
  Messages: {
    screen: Messages,
    navigationOptions: ({ screenProps }) => ({
      title: '消息',
      tabBarIcon: ({ tintColor }) => (
        <Image
          source={require('./assets/icons/Messages.png')}
          style={{
            position: 'relative',
            tintColor: tintColor,
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
    navigationOptions: {
      title: '个人中心',
      tabBarIcon: ({ tintColor }) => (
        <Image
          source={require('./assets/icons/PersonalCenter.png')}
          style={{
            tintColor: tintColor,
            ...iconStyle
          }}
        />
      )
    }
  }
}, {
  tabBarComponent: TabBarBottom,
  tabBarPosition: 'bottom',
  swipeEnabled: true,
  animationEnabled: true,
  lazy: true,
  tabBarOptions: {
    backBehavior: 'none',
    activeTintColor: Component.prototype.$mainColor,
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
    navigationOptions: {
      title: '在线测试',
      ...standardNavigationOptions
    }
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

export default class SavingsTestApplication extends Component {
  constructor (props) {
    super(props)
    this.state = {
      hasNewMessages: false,
      hasPassedTheExam: false
    }
  }

  render () {
    return (
      <App
        screenProps={{
          hasNewMessages: this.state.hasNewMessages,
          hasPassedTheExam: this.state.hasPassedTheExam,
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
