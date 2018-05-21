'use strict'

import React, { PureComponent } from 'react'
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

export default class SignIn extends PureComponent {
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

  async componentDidMount () {
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
              placeholder={this.$i18n.t('mobilePhone')}
              returnKeyType='next'
              onChangeText={(mobilePhone) => this.setState({ mobilePhone })}
              onSubmitEditing={() => this.passwordInput.focus()}
            />
            <CustomTextInput
              ref={(passwordInput) => this.passwordInput = passwordInput}
              marginBottom={16}
              secureTextEntry={true}
              theme='light'
              placeholder={this.$i18n.t('password')}
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
              onPress={() => this.props.navigation.navigate('EditInfo', {
                title: this.$i18n.t('mobilePhone'),
                buttonText: this.$i18n.t('editInfo.getVerificationCode')
              })}
            >
              <Text style={{
                color: '#fff'
              }}>{this.$i18n.t('signIn.getBackPassword')}</Text>
            </TouchableOpacity>
            <CustomButton
              onPress={() => this.signIn()}
              text={this.$i18n.t('signIn.signIn')}
            />
          </KeyboardAvoidingView>
        </Image>
      </ScrollView>
    )
  }

  async signInSuccessfully (token) {
    await this.$storage.save({
      key: 'token',
      data: token
    })

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

  async signIn () {
    if (this.state.mobilePhone === '') {
      Alert.alert(
        this.$i18n.t('signIn.signIn'),
        this.$i18n.t('signIn.inputMobilePhone'),
        [{ text: this.$i18n.t('alert.confirm') }]
      )
    } else if (this.state.password === '') {
      Alert.alert(
        this.$i18n.t('signIn.signIn'),
        this.$i18n.t('signIn.inputPassword'),
        [{ text: this.$i18n.t('alert.confirm') }]
      )
    } else {
      const response = (await this.$JSONAjax({
        method: 'post',
        url: 'user/signIn',
        data: this.state
      })).data
  
      if (response.statusCode === 100) {
        Alert.alert(
          this.$i18n.t('signIn.signIn'),
          this.$i18n.t('signIn.signInSuccessfully'),
          [
            {
              text: this.$i18n.t('alert.confirm'),
              onPress: () => this.signInSuccessfully(response.result.token)
            }
          ],
          { onDismiss: () => this.signInSuccessfully(response.result.token) }
        )
      } else if (response.statusCode === 101) {
        Alert.alert(
          this.$i18n.t('signIn.signIn'),
          this.$i18n.t('signIn.wrongMobileOrPassword'),
          [
            {
              text: this.$i18n.t('alert.confirm'),
            }
          ]
        )
      }
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
