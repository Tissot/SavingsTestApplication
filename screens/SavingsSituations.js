'use strict'

'use strict'

import React, { PureComponent } from 'react'
import {
  View,
  SectionList,
  Text
} from 'react-native'

import {
  ListItem,
  SectionHeaderComponent,
  ItemSeparatorComponent
} from '../components'

export default class SavingsSituations extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      refreshing: false,
      userHasBeenDeleted: false,
      savingsSituations: []
    }
  }

  componentDidMount () {
    this.getSavingsSituations()
  }
  
  render () {
    const { title, group, userId } = this.props.navigation.state.params
    const savingsSituationsType = [
      this.$i18n.t('monthlySavingsSituations.title'),
      this.$i18n.t('historicalSavingsSituations.title'),
      this.$i18n.t('childrenEduSavingsSituations.title')
    ].indexOf(title)

    return (
      <View style={[
        {
          flex: 1,
          backgroundColor: this.$screenBackgroundColor
        },
        this.state.savingsSituations.length === 0 && {
          justifyContent: 'center',
          alignItems: 'center'
        }
      ]}>
        {
          this.state.userHasBeenDeleted === false ? <SectionList
              sections={this.state.savingsSituations}
              keyExtractor={(item) => item.key}
              renderItem={({item}) => <ListItem
                itemKey={item.key}
                itemValue={
                  item.value === null
                  ? item.key === this.$i18n.t('monthlySavingsSituations.monthlyRecommendedSavings')
                  ? this.$i18n.t('null') : this.$i18n.t('unfilled')
                  : String(item.value)
                }
                onPress={
                  item.value === null
                  && item.key !== this.$i18n.t('monthlySavingsSituations.monthlyRecommendedSavings')
                  && userId === undefined ? () => this.props.navigation.navigate('EditInfo', {
                    savingsSituationsType,
                    title: savingsSituationsType === 0 ? item.key : item.year + this.$i18n.t('year') + item.key,
                    defaultValue: item.value,
                    refreshFunction: () => this.getSavingsSituations()
                  }) : undefined
                }
              />}
              renderSectionHeader={(({ section }) => <SectionHeaderComponent
                sectionHeaderText={
                  (
                    title === this.$i18n.t('historicalSavingsSituations.title')
                    || title === this.$i18n.t('childrenEduSavingsSituations.title')
                  )
                  && section.key
                  || undefined
                }
              />)}
              ListHeaderComponent={(group === 1 || group === 2) && (() => (
                <View style={{
                  paddingTop: 20,
                  paddingBottom: 20,
                  paddingLeft: 24,
                  paddingRight: 24,
                  backgroundColor: '#fff'
                }}>
                  <Text style={{
                    fontSize: 14,
                    color: '#8f8f8f'
                  }}>{this.$i18n.t('historicalSavingsSituations.tips')}</Text>
                </View>
              ))}
              ItemSeparatorComponent={ItemSeparatorComponent}
              refreshing={this.state.refreshing}
              onRefresh={() => this.getSavingsSituations()}
            />
            : <Text style={{ fontSize: 16 }}>{ this.$i18n.t('userHasBeenDeleted') }</Text>
          }
      </View>
    )
  }

  getSavingsSituations () {
    this.setState({ refreshing: true }, async () => {
      const { title, userId } = this.props.navigation.state.params
      const savingsSituationType = [
        this.$i18n.t('historicalSavingsSituations.title'),
        this.$i18n.t('childrenEduSavingsSituations.title')
      ].indexOf(title)

      if (title === this.$i18n.t('monthlySavingsSituations.title')) {
        const response = (await this.$JSONAjax({
          method: 'post',
          url: '/savingsSituation/getEachMonthSavingsSituations'
        })).data
    
        if (response.statusCode === 100) {
          await this.$storage.save({
            key: 'eachMonthActualSavings',
            data: response.result.eachMonthSavingsSituations[3]
          })

          this.setState({
            savingsSituations: [
              {
                key: '0',
                data: [ 
                  {
                    key: this.$i18n.t('monthlySavingsSituations.monthlyOutcome'),
                    value: response.result.eachMonthSavingsSituations[0]
                  },
                  {
                    key: this.$i18n.t('monthlySavingsSituations.monthlyIncome'),
                    value: response.result.eachMonthSavingsSituations[1]
                  }
                ]
              },
              {
                key: '1',
                data: [
                  {
                    key: this.$i18n.t('monthlySavingsSituations.monthlyRecommendedSavings'),
                    value: response.result.eachMonthSavingsSituations[2]
                  }
                ]
              },
              {
                key: '2',
                data: [
                  {
                    key: this.$i18n.t('monthlySavingsSituations.monthlyGoal'),
                    value: response.result.eachMonthSavingsSituations[3]
                  }
                ]
              }
            ]
          })
        }
      } else if (savingsSituationType !== -1) {
        const response = (await this.$JSONAjax({
          method: 'post',
          url: '/savingsSituation/getHistoricalSavingsSituations',
          data: {
            savingsSituationType
          }
        })).data

        const transform = {
          '一月实际储蓄额': this.$i18n.t('historicalSavingsSituations.Jan'),
          '二月实际储蓄额': this.$i18n.t('historicalSavingsSituations.Feb'),
          '三月实际储蓄额': this.$i18n.t('historicalSavingsSituations.Mar'),
          '四月实际储蓄额': this.$i18n.t('historicalSavingsSituations.Apr'),
          '五月实际储蓄额': this.$i18n.t('historicalSavingsSituations.May'),
          '六月实际储蓄额': this.$i18n.t('historicalSavingsSituations.Jun'),
          '七月实际储蓄额': this.$i18n.t('historicalSavingsSituations.Jul'),
          '八月实际储蓄额': this.$i18n.t('historicalSavingsSituations.Aug'),
          '九月实际储蓄额': this.$i18n.t('historicalSavingsSituations.Sep'),
          '十月实际储蓄额': this.$i18n.t('historicalSavingsSituations.Oct'),
          '十一月实际储蓄额': this.$i18n.t('historicalSavingsSituations.Nov'),
          '十二月实际储蓄额': this.$i18n.t('historicalSavingsSituations.Dec')
        }

        response.result.historicalSavingsSituations.forEach(historicalSavingsSituation => {
          historicalSavingsSituation.data.forEach(actualSavingsSituation => {
            actualSavingsSituation.key = transform[actualSavingsSituation.key]
            actualSavingsSituation.year = historicalSavingsSituation.key
          })
        })
    
        if (response.statusCode === 100) {
          this.setState({ savingsSituations: response.result.historicalSavingsSituations })
        }
      } else if (title !== undefined && userId !== undefined) {
        const response = (await this.$JSONAjax({
          method: 'post',
          url: '/savingsSituation/getUserSavingsSituations',
          data: {
            _id: userId
          }
        })).data
    
        if (response.statusCode === 100) {
          this.setState({
            savingsSituations: [
              {
                key: '0',
                data: [
                  {
                    key: this.$i18n.t('monthlySavingsSituations.monthlyGoal'),
                    value: response.result[0]
                  },
                  {
                    key: this.$i18n.t('peerSavingsSituations.latestSavings'),
                    value: response.result[1]
                  }
                ]
              },
              {
                key: '1',
                data: [
                  {
                    key: this.$i18n.t('peerSavingsSituations.whetherAchieveGoal'),
                    value: response.result[2]
                  }
                ]
              }
            ]
          })
        } else if (response.statusCode === 101) {
          this.setState({ userHasBeenDeleted: true })
        }
      }

      this.setState({ refreshing: false })
    })
  }
}
