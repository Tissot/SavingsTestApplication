'use strict'

import React, { PureComponent } from 'react'
import {
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Alert
} from 'react-native'

import {
  CustomButton,
  CustomTextInput
} from '../components'


export default class EditInfo extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      counter: 0,
      info: this.props.navigation.state.params.defaultValue
    }
  }

  componentDidMount () {
    if (this.props.navigation.state.params.title === this.$i18n.t('editInfo.verificationCode')) {
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
            secureTextEntry={title === this.$i18n.t('editInfo.newPassword')}
            maxLength={title === this.$i18n.t('personalSettings.nickname') ? 20 : undefined}
            keyboardType={
              (
                this.formatSavingsSituation() !== -1
                || title === this.$i18n.t('editInfo.verificationCode')
              )
              && 'numeric'
              || title === this.$i18n.t('mobilePhone')
              && 'phone-pad'
              || undefined
            }
            placeholder={this.$i18n.t('unfilled')}
            returnKeyType='done'
            defaultValue={defaultValue}
            autoFocus={true}
            onChangeText={info => this.setState({ info })}
            onSubmitEditing={() => this.finishEdit()}
            style={{
              flex: 1,
              marginRight: 8
            }}
          />
          {
            title === this.$i18n.t('editInfo.verificationCode') && <CustomButton
              width={100}
              onPress={this.state.counter === 0 && (() => this.getAuthenticode()) || undefined}
              text={this.state.counter === 0 ? this.$i18n.t('editInfo.getAgain') : `${this.state.counter}s`}
            />
          }
        </KeyboardAvoidingView>
        <CustomButton
          onPress={() => this.finishEdit()}
          text={buttonText || this.$i18n.t('editInfo.finish')}
        />
      </ScrollView>
    )
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

    if (response.statusCode === 100) {
      Alert.alert(
        this.$i18n.t('editInfo.getVerificationCode'),
        this.$i18n.t('editInfo.getSuccessfully'),
        [{ text: this.$i18n.t('alert.confirm') }]
      )

      this.setState({ counter: 60 }, () => {
        this.timer = setInterval(() => {
          if (this.state.counter <= 0) {
            this.timer && clearInterval(this.timer)
          } else {
            this.setState((prevState, props) => ({ counter: prevState.counter - 1 }))
          }
        }, 1000)
      })
    } else if (response.statusCode === 101) {
      Alert.alert(
        this.$i18n.t('editInfo.getVerificationCode'),
        this.$i18n.t('editInfo.failedToGet'),
        [
          {
            text: this.$i18n.t('alert.confirm'),
            onPress: () => this.props.navigation.goBack()
          }
        ]
      )
    }
  }

  formatSavingsSituation () {
    const { title } = this.props.navigation.state.params
    const eachMonthSavingsSituations = [
      this.$i18n.t('monthlySavingsSituations.monthlyOutcome'),
      this.$i18n.t('monthlySavingsSituations.monthlyIncome'),
      this.$i18n.t('monthlySavingsSituations.monthlyGoal')
    ]
    const eachMonthSavingsSituation = eachMonthSavingsSituations.indexOf(title)
    let historicalSavingsSituation = '';

    for (let i = 5; Number.isInteger(Number(title[i])); ++i) {
      historicalSavingsSituation += title[i]
    }

    if (eachMonthSavingsSituation !== -1) {
      return eachMonthSavingsSituation
    } else if (historicalSavingsSituation >= 1 && historicalSavingsSituation <= 12) {
      historicalSavingsSituation < 10 && (historicalSavingsSituation = '0' + historicalSavingsSituation)
      return title.substring(0, 4) + historicalSavingsSituation
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
      } else if (
        response.statusCode === 101
        && title === this.$i18n.t('monthlySavingsSituations.monthlyGoal')
      ) {
        this.props.navigation.goBack()
      }
    } else {
      this.props.navigation.navigate('SavingsSituations', {
        title: this.$i18n.t('monthlySavingsSituations.title')
      })
    }
  }

  async editSavingsSituation (savingsSituation) {
    const {  title, savingsSituationsType, refreshFunction } = this.props.navigation.state.params

    if (savingsSituationsType === 1) {
      const eachMonthActualSavings = await this.$storage.load({
        key: 'eachMonthActualSavings'
      })

      if (eachMonthActualSavings === null) {
        Alert.alert(
          this.$i18n.t('editInfo.submitResult'),
          this.$i18n.t('editInfo.completeMonthlyGoalFirst'),
          [
            {
              text: this.$i18n.t('alert.confirm'),
              onPress: () => this.handleFinishEditResponse()
            }
          ],
          { onDismiss: () => this.handleFinishEditResponse() }
        )
      } else {
        this.props.navigation.navigate('EditInfo', {
          title: this.state.info < eachMonthActualSavings
          ? this.$i18n.t('editInfo.theReasonNotAchieveGoal')
          : this.$i18n.t('editInfo.theReasonAchieveGoal'),
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

      if (response.statusCode === 100) {
        Alert.alert(
          this.$i18n.t('editInfo.submitResult'),
          this.$i18n.t('editInfo.submitSuccessfully'),
          [
            {
              text: this.$i18n.t('alert.confirm'),
              onPress: () => this.handleFinishEditResponse(response)
            }
          ],
          { onDismiss: () => this.handleFinishEditResponse(response) }
        )
      } else if (response.statusCode === 101) {
        Alert.alert(
          this.$i18n.t('editInfo.submitResult'),
          this.$i18n.t('editInfo.failedToSubmit'),
          [{ text: this.$i18n.t('alert.confirm') }]
        )
      }
    }
  }

  async finishEdit () {
    const { title, savingsSituationsType, savings, mobilePhone, goBackKey, refreshFunction } = this.props.navigation.state.params
    let savingsSituation = this.formatSavingsSituation()

    if (savingsSituation !== -1) {
      Alert.alert(
        this.$i18n.t('editInfo.tips'),
        this.$i18n.t('editInfo.immutableAfterSubmitting'),
        [
          {
            text: this.$i18n.t('alert.cancel'),
            style: 'cancel'
          },
          {
            text: this.$i18n.t('alert.confirm'),
            onPress: () => this.editSavingsSituation(savingsSituation)
          }
        ]
      )
    } else if (
      title === this.$i18n.t('editInfo.theReasonAchieveGoal')
      || title === this.$i18n.t('editInfo.theReasonNotAchieveGoal')
    ) {
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

      if (response.statusCode === 100) {
        Alert.alert(
          this.$i18n.t('editInfo.submitResult'),
          this.$i18n.t('editInfo.submitSuccessfully'),
          [
            {
              text: this.$i18n.t('alert.confirm'),
              onPress: () => this.handleFinishEditResponse(response)
            }
          ],
          { onDismiss: () => this.handleFinishEditResponse(response) }
        )
      } else if (response.statusCode === 101) {
        Alert.alert(
          this.$i18n.t('editInfo.submitResult'),
          this.$i18n.t('editInfo.failedToSubmit'),
          [{ text: this.$i18n.t('alert.confirm') }]
        )
      }
    } else if (title === this.$i18n.t('mobilePhone')) {
      this.props.navigation.navigate('EditInfo', {
        title: this.$i18n.t('editInfo.verificationCode'),
        buttonText: this.$i18n.t('editInfo.next'),
        mobilePhone: this.state.info,
        goBackKey: this.props.navigation.state.key
      })
    } else if (title === this.$i18n.t('editInfo.verificationCode')) {
      const response = (await this.$JSONAjax({
        method: 'post',
        url: '/user/checkVerificationCode',
        data: {
          mobilePhone,
          verificationCode: this.state.info
        }
      })).data

      if (response.statusCode === 100) {
        Alert.alert(
          this.$i18n.t('editInfo.submitResult'),
          this.$i18n.t('editInfo.submitSuccessfully'),
          [
            {
              text: this.$i18n.t('alert.confirm'),
              onPress: () => this.props.navigation.navigate('EditInfo', {
                  title: this.$i18n.t('editInfo.newPassword'),
                  mobilePhone,
                  goBackKey: goBackKey || this.props.navigation.state.key
                })
              }
          ],
          {
            onDismiss: () =>  this.props.navigation.navigate('EditInfo', {
              title: this.$i18n.t('editInfo.newPassword'),
              mobilePhone,
              goBackKey
            })
          }
        )
      } else if (response.statusCode === 101) {
        Alert.alert(
          this.$i18n.t('editInfo.submitResult'),
          this.$i18n.t('editInfo.wrongVerificationCode'),
          [{ text: this.$i18n.t('alert.confirm') }]
        )
      }
    } else if (title === this.$i18n.t('editInfo.newPassword')) {
      const response = (await this.$JSONAjax({
        method: 'post',
        url: '/user/editPassword',
        data: {
          mobilePhone,
          password: this.state.info
        }
      })).data

      if (response.statusCode === 100) {
        Alert.alert(
          this.$i18n.t('editInfo.submitResult'),
          this.$i18n.t('editInfo.submitSuccessfully'),
          [
            {
              text: this.$i18n.t('alert.confirm'),
              onPress: () => this.handleFinishEditResponse(response)
            }
          ],
          { onDismiss: () => this.handleFinishEditResponse(response) }
        )
      } else if (response.statusCode === -1000) {
        Alert.alert(
          this.$i18n.t('editInfo.submitResult'),
          this.$i18n.t('editInfo.passwordLimit'),
          [{ text: this.$i18n.t('alert.confirm') }]
        )
      }
    } else if (title === this.$i18n.t('personalSettings.nickname')) {
      if (this.checkNicknameLength() === true) {
        const response = (await this.$JSONAjax({
          method: 'post',
          url: '/user/editNickname',
          data: {
            nickname: this.state.info
          }
        })).data

        if (response.statusCode === 100) {
          Alert.alert(
            this.$i18n.t('editInfo.submitResult'),
            this.$i18n.t('editInfo.submitSuccessfully'),
            [
              {
                text: this.$i18n.t('alert.confirm'),
                onPress: () => this.handleFinishEditResponse(response)
              }
            ],
            { onDismiss: () => this.handleFinishEditResponse(response) }
          )
        } else if (response.statusCode === 101) {
          Alert.alert(
            this.$i18n.t('editInfo.submitResult'),
            this.$i18n.t('editInfo.failedToSubmit'),
            [{ text: this.$i18n.t('alert.confirm') }]
          )
        }
      } else {
        Alert.alert(
          this.$i18n.t('editInfo.submitResult'),
          this.$i18n.t('editInfo.nicknameLimit'),
          [{ text: this.$i18n.t('alert.confirm') }]
        )
      }
    }
  }
}
