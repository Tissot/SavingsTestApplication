'use strict'

import React, { Component } from 'react'
import {
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
  Text,
  Alert,
  StyleSheet
} from 'react-native'

import { NavigationActions } from 'react-navigation'

import {
  CustomButton,
  CustomTextInput
} from '../components'

export default class SignIn extends Component {
  constructor (props) {
    super(props)

    /* 
      mobilePhone: string,
      password: string
    */
    this.state = {
      mobilePhone: '',
      password: ''
    }
  }

  async componentWillMount () {
    this.signInAutomatically()
  }

  render () {
    return (
      <ScrollView
        keyboardShouldPersistTaps='handled'
        alwaysBounceVertical={this.$OS === 'ios' ? false : undefined} // ios
        contentContainerStyle={styles.signIn}
      >
        <StatusBar
          animated={true}
          hidden={true}
          backgroundColor={this.$OS === 'android' ? 'transparent' : undefined} // android
        />
        <Image source={require('../assets/images/SignInBackground.jpg')} style={styles.signInBackground}>
          <KeyboardAvoidingView behavior='padding' style={[
            styles.signInForm,
            { margin: this.$horizontalSpacingDistance }
          ]}>
            <CustomTextInput
              theme='light'
              keyboardType='phone-pad'
              placeholder='手机'
              returnKeyType='next'
              onChangeText={(mobilePhone) => this.setState({ mobilePhone })}
              onSubmitEditing={() => this.passwordInput.focus()}
            />
            <CustomTextInput
              ref={(passwordInput) => this.passwordInput = passwordInput}
              marginBottom={16}
              secureTextEntry={true}
              theme='light'
              placeholder='密码'
              returnKeyType='done'
              onChangeText={(password) => this.setState({ password })}
              onSubmitEditing={() => this.signIn()}
            />
            <TouchableOpacity
              style={{
                marginBottom: 16,
                backgroundColor: 'transparent'
              }}
              activeOpacity={.8}
              onPress={() => this.props.navigation.navigate('EditInfo', { title: '手机号', buttonText: '获取验证码' })}
            >
              <Text style={{
                color: '#fff'
              }}>忘记密码？</Text>
            </TouchableOpacity>
            <CustomButton
              onPress={() => this.signIn()}
              text='登录'
            />
          </KeyboardAvoidingView>
        </Image>
      </ScrollView>
    )
  }

  shouldComponentUpdate () {
    return false
  }

  async signInSuccessfully (token) {
    this.$JSONAjax.defaults.headers.common['token'] = token,

    this.props.navigation.dispatch(NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'User' })]
    }))

    await Promise.all([
      this.props.screenProps.checkHasNewMessages(),
      this.props.screenProps.getHasPassedTheExam()
    ])
  }

  async signInAutomatically () {
    try {
      const token = await this.$storage.load({
        key: 'token',
        autoSync: false,
        syncInBackground: false
      })
  
      token && this.signInSuccessfully(token)
    } catch (err) {
    }
  }

  async handleSignInResponse (response) {
    if (response.statusCode === 100) {
      await this.$storage.save({
        key: 'token',
        data: response.result.token
      })

      this.signInSuccessfully(response.result.token)
    }
  }

  async signIn () {
    if (this.state.mobilePhone === '') {
      Alert.alert('登录', '请输入手机号', [{text: '确认'}])
    } else if (this.state.password === '') {
      Alert.alert('登录', '请输入密码', [{text: '确认'}])
    } else {
      const response = (await this.$JSONAjax({
        method: 'post',
        url: 'user/signIn',
        data: this.state
      })).data
  
      Alert.alert('登录', response.message, [
        {
          text: '确认',
          onPress: () => this.handleSignInResponse(response)
        }
      ], {
        onDismiss: () => this.handleSignInResponse(response)
      })
    }
  }
}

const styles = StyleSheet.create({
  signIn: {
    flex: 1,
  },
  signInBackground: {
    flex: 1,
    width: null,
    height: null
  },
  signInForm: {
    flex: 1,
    marginTop: 64,
    alignItems: 'flex-start',
  },
  logo: {
    width: 180,
    height: 60
  }
})
