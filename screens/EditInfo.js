'use strict'

import React, { Component } from 'react'
import {
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Alert
} from 'react-native'

import CustomButton from '../components/CustomButton.js'
import CustomTextInput from '../components/CustomTextInput.js'

export default class EditInfo extends Component {
  constructor (props) {
    super(props)
    this.state = {
      counter: 60,
      info: this.props.navigation.state.params.defaultValue
    }
  }

  componentWillMount () {
    if (this.props.navigation.state.params.title === '手机验证码') {
      this.getAuthenticode()
    }
  }

  render () {
    const { title, defaultValue, buttonText } = this.props.navigation.state.params

    return (
      <ScrollView
        keyboardShouldPersistTaps='handled'
        alwaysBounceVertical={this.$OS === 'ios' ? false : undefined} // ios
        contentContainerStyle={[
          { 
            flex: 1,
            paddingTop: this.$verticalSpacingDistance,
            paddingBottom: this.$verticalSpacingDistance,
            paddingLeft: this.$horizontalSpacingDistance,
            paddingRight: this.$horizontalSpacingDistance,
            backgroundColor: '#fff'
          }
        ]}
      >
        <StatusBar
          animated={true}
          hidden={false}
          barStyle='light-content'
          backgroundColor={this.$OS === 'android' ? this.$mainColor : undefined} // android
        />
        <KeyboardAvoidingView behavior='padding' style={{
          flexDirection: 'row'
        }}>
          <CustomTextInput
            secureTextEntry={title === '新密码'}
            maxLength={title === '昵称' ? 20 : undefined}
            keyboardType={(this.formatSavingsSituation() !== -1 || title === '手机验证码') && 'numeric' || title === '手机号' && 'phone-pad' || undefined}
            placeholder={'未填写'}
            returnKeyType='done'
            defaultValue={defaultValue}
            autoFocus={true}
            onChangeText={(info) => this.setState({ info: info })}
            onSubmitEditing={() => this.finishEdit()}
            style={{
              flex: 1,
              marginRight: 8
            }}
          />
          {
            title === '手机验证码' && <CustomButton
              width={100}
              onPress={this.state.counter === 0 && (() => this.getAuthenticode()) || undefined}
              text={this.state.counter === 0 ? '重新获取' : `${this.state.counter}s`}
            />
          }
        </KeyboardAvoidingView>
        <CustomButton
          onPress={() => this.finishEdit()}
          text={buttonText || '完成'}
        />
      </ScrollView>
    )
  }

  shouldComponentUpdate (newProps, newState) {
    return this.state.counter !== newState.counter
  }

  componentWillUnmount() {
    this.timer !== undefined && clearInterval(this.timer)
  }

  async getAuthenticode () {
    const response = (await this.$JSONAjax({
      method: 'post',
      url: '/user/getVerificationCode',
      data: {
        mobilePhone: this.props.navigation.state.params.mobilePhone
      }
    })).data

    Alert.alert('获取手机验证码', response.message, [
      {
        text: '确认'
      }
    ])

    if (response.statusCode === 100) {
      this.setState((prevState, props) => ({
        counter: 60
      }))

      this.timer = setInterval(() => {
        if (this.state.counter <= 0) {
          this.timer && clearInterval(this.timer)
        } else {
          this.setState((prevState, props) => ({
            counter: --this.state.counter
          }))
        }
      }, 1000)
    }
  }

  formatHistoricalSavingsSituation (historicalSavingsSituation) {
    const { title } = this.props.navigation.state.params
    historicalSavingsSituation = String(historicalSavingsSituation + 1)
    if (historicalSavingsSituation.length === 1) {
      historicalSavingsSituation = '0' + historicalSavingsSituation
    }
    return title.substring(0, 4) + historicalSavingsSituation
  }

  formatSavingsSituation () {
    const { title } = this.props.navigation.state.params
    const eachMonthSavingsSituations = ['每月支出', '每月收入', '每月期望储蓄额']
    const historicalSavingsSituations = [
      '一月实际储蓄额',
      '二月实际储蓄额',
      '三月实际储蓄额',
      '四月实际储蓄额',
      '五月实际储蓄额',
      '六月实际储蓄额',
      '七月实际储蓄额',
      '八月实际储蓄额',
      '九月实际储蓄额',
      '十月实际储蓄额',
      '十一月实际储蓄额',
      '十二月实际储蓄额'
    ]
    const eachMonthSavingsSituation = eachMonthSavingsSituations.indexOf(title)
    const historicalSavingsSituation = historicalSavingsSituations.indexOf(title.substring(5))

    if (eachMonthSavingsSituation !== -1) {
      return eachMonthSavingsSituation
    } else if (historicalSavingsSituation !== -1) {
      return this.formatHistoricalSavingsSituation(historicalSavingsSituation)
    } else {
      return -1
    }
  }

  checkNicknameLength () {
    let nicknameLength = 0
    
    for (let i = 0; i < this.state.info.length; ++i) {
      if (this.state.info.charCodeAt(i) > 0 && this.state.info.charCodeAt(i) < 128) {
        ++nicknameLength
      } else {
        nicknameLength += 2
      }

      if (nicknameLength > 20) {
        return false
      }
    }

    return true
  }

  async handleFinishEditResponse (response) {
    const { title, goBackKey, refreshFunction } = this.props.navigation.state.params
    if (response !== undefined) {
      if (response.statusCode === 100) {
        refreshFunction !== undefined && refreshFunction()
        goBackKey === undefined ? this.props.navigation.goBack() : this.props.navigation.goBack(goBackKey)
      } else if (response.statusCode === 101 && title === '每月期望储蓄额') {
        this.props.navigation.goBack()
      }
    } else {
      this.props.navigation.navigate('SavingsSituations', { title: '每月储蓄情况' })
    }
  }

  async editSavingsSituation (savingsSituation) {
    const {  title, savingsSituationsType, refreshFunction } = this.props.navigation.state.params

    if (savingsSituationsType === 1) {
      const eachMonthActualSavings = await this.$storage.load({
        key: 'eachMonthActualSavings'
      })

      if (eachMonthActualSavings === null) {
        Alert.alert(`修改${title}`, '请先填写每月期望储蓄额', [
          {
            text: '确认',
            onPress: () => this.handleFinishEditResponse()
          }
        ], {
          onDismiss: () => this.handleFinishEditResponse()
        })
      } else {
        this.props.navigation.navigate('EditInfo', {
          title: `${this.state.info < eachMonthActualSavings ? '未' : ''}达成期望储蓄额的原因`,
          savingsSituationsType,
          savingsSituation,
          savings: Number(this.state.info),
          goBackKey: this.props.navigation.state.key,
          refreshFunction: () => refreshFunction()
        })
      }
    } else {
      const response = (await this.$JSONAjax({
        method: 'post',
        url: '/savingsSituation/editSavingsSituation',
        data: {
          savingsSituationsType,
          savingsSituation,
          value: Number(this.state.info)
        }
      })).data

      Alert.alert(`修改${title}`, response.message, [
        {
          text: '确认',
          onPress: () => this.handleFinishEditResponse(response)
        }
      ], {
        onDismiss: () => this.handleFinishEditResponse(response)
      })
    }
  }

  async finishEdit () {
    const { title, savingsSituationsType, savings, mobilePhone, goBackKey, refreshFunction } = this.props.navigation.state.params
    let savingsSituation = this.formatSavingsSituation()

    if (savingsSituation !== -1) {
      Alert.alert('温馨提示', '提交后不可更改', [
        {
          text: '取消',
          style: 'cancel'
        },
        {
          text: '继续提交',
          onPress: () => this.editSavingsSituation(savingsSituation)
        }
      ])
    } else if (title === '达成期望储蓄额的原因' || title === '未达成期望储蓄额的原因') {
      const response = (await this.$JSONAjax({
        method: 'post',
        url: '/savingsSituation/editSavingsSituation',
        data: {
          savingsSituationsType,
          savingsSituation: this.props.navigation.state.params.savingsSituation,
          value: savings,
          reason: this.state.info
        }
      })).data

      Alert.alert('提交结果', response.message, [
        {
          text: '确认',
          onPress: () => this.handleFinishEditResponse(response)
        }
      ], {
        onDismiss: () => this.handleFinishEditResponse(response)
      })
    } else if (title === '手机号') {
      if (/^1[3|4|5|7|8]\d{9}$/.test(this.state.info)) {
        this.props.navigation.navigate('EditInfo', {
          title: '手机验证码',
          buttonText: '下一步',
          mobilePhone: this.state.info,
          goBackKey: this.props.navigation.state.key
        })
      } else {
        Alert.alert('获取手机验证码', '手机格式错误', [{text: '确认'}])
      }
    } else if (title === '手机验证码') {
      const response = (await this.$JSONAjax({
        method: 'post',
        url: '/user/checkVerificationCode',
        data: {
          mobilePhone,
          verificationCode: this.state.info
        }
      })).data

      Alert.alert('验证结果', response.message, [
        {
          text: '确认',
          onPress: () => {
            if (response.statusCode === 100) {
              this.props.navigation.navigate('EditInfo', {
                title: '新密码',
                mobilePhone,
                goBackKey: goBackKey || this.props.navigation.state.key
              })
            }
          }
        }
      ], {
        onDismiss: () => {
          if (response.statusCode === 100) {
            this.props.navigation.navigate('EditInfo', {
              title: '新密码',
              mobilePhone,
              goBackKey
            })
          }
        }
      })
    } else if (title === '新密码') {
      const response = (await this.$JSONAjax({
        method: 'post',
        url: '/user/editPassword',
        data: {
          mobilePhone,
          password: this.state.info
        }
      })).data

      Alert.alert('密码', response.message, [
        {
          text: '确认',
          onPress: () => this.handleFinishEditResponse(response)
        }
      ], {
        onDismiss: () => this.handleFinishEditResponse(response)
      })
    } else if (title === '昵称') {
      if (this.checkNicknameLength() === true) {
        const response = (await this.$JSONAjax({
          method: 'post',
          url: '/user/editNickname',
          data: {
            nickname: this.state.info
          }
        })).data

        Alert.alert('修改昵称', response.message, [
          {
            text: '确认',
            onPress: () => this.handleFinishEditResponse(response)
          }
        ], {
          onDismiss: () => this.handleFinishEditResponse(response)
        })
      } else {
        Alert.alert('修改昵称', '昵称最多为20个字符（英文、数字、符号算1个字符，其它算2个字符）', [{text: '确认'}])
      }
    }
  }
}
