'use strict'

'use strict'

import React, { Component } from 'react'
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

export default class SavingsSituations extends Component {
  constructor (props) {
    super(props)
    this.state = {
      refreshing: false,
      savingsSituations: []
    }
  }

  componentWillMount () {
    this.getSavingsSituations()
  }
  
  render () {
    const { title, group, userId } = this.props.navigation.state.params
    const savingsSituationsType = ['每月储蓄情况', '历史储蓄情况', '子女教育储蓄情况'].indexOf(title)

    return (
      <View style={{
        flex: 1,
        backgroundColor: this.$screenBackgroundColor
      }}>
        <SectionList
          sections={this.state.savingsSituations}
          keyExtractor={(item) => item.key}
          renderItem={({item}) => <ListItem
            itemKey={item.key}
            itemValue={item.value === null ? item.key === '每月建议储蓄额' ? '无' : '未填写' : String(item.value)}
            onPress={item.value === null && item.key !== '每月建议储蓄额' && userId === undefined ? () => this.props.navigation.navigate('EditInfo', {
              savingsSituationsType,
              title: savingsSituationsType === 0 ? item.key : `${item.year}年${item.key}`,
              defaultValue: item.value,
              refreshFunction: () => this.getSavingsSituations()
            }) : undefined}
          />}
          renderSectionHeader={(({ section }) => <SectionHeaderComponent
            sectionHeaderText={(title === '历史储蓄情况' || title === '子女教育储蓄情况') && section.key || undefined}
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
              }}>历史储蓄情况的每月实际储蓄额包含对应月份的子女教育实际储蓄额。</Text>
            </View>
          ))}
          ItemSeparatorComponent={ItemSeparatorComponent}
          refreshing={this.state.refreshing}
          onRefresh={() => this.getSavingsSituations()}
        />
      </View>
    )
  }

  getSavingsSituations () {
    this.setState({ refreshing: true }, async () => {
      const { title, userId } = this.props.navigation.state.params
      const savingsSituationType = ['历史储蓄情况', '子女教育储蓄情况'].indexOf(title)

      if (title === '每月储蓄情况') {
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
                  { key: '每月支出', value: response.result.eachMonthSavingsSituations[0] },
                  { key: '每月收入', value: response.result.eachMonthSavingsSituations[1] }
                ]
              },
              {
                key: '1',
                data: [
                  { key: '每月建议储蓄额', value: response.result.eachMonthSavingsSituations[2] }
                ]
              },
              {
                key: '2',
                data: [
                  { key: '每月期望储蓄额', value: response.result.eachMonthSavingsSituations[3] }
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

        for (let historicalSavingsSituation of response.result.historicalSavingsSituations) {
          for (let actualSavingsSituation of historicalSavingsSituation.data) {
            actualSavingsSituation.year = historicalSavingsSituation.key
          }
        }
    
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
                    key: '每月期望储蓄额',
                    value: response.result[0]
                  },
                  {
                    key: '最新实际储蓄额',
                    value: response.result[1]
                  }
                ]
              },
              {
                key: '1',
                data: [
                  {
                    key: '是否达成期望储蓄额',
                    value: response.result[2]
                  }
                ]
              }
            ]
          })
        }
      }

      this.setState({ refreshing: false })
    })
  }
}
