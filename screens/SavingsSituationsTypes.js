'use strict'

import React, { Component } from 'react'
import {
  View,
  SectionList,
  Alert
} from 'react-native'

import NoPermissionToVisit from '../components/NoPermissionToVisit.js'
import ListItem from '../components/ListItem.js'
import ItemSeparatorComponent from '../components/ItemSeparatorComponent.js'

export default class SavingsSituationsTypes extends Component {
  constructor (props) {
    super(props)
    this.state = {
      refreshing: false,
      group: -1,
      savingsSituationsTypes: []
    }
  }

  componentWillMount () {
    this.props.screenProps.hasPassedTheExam === true && this.getSavingsSituationsTypes()
  }
  
  render () {
    return (
      <View style={{
        flex: 1,
        justifyContent: this.props.screenProps.hasPassedTheExam === false ? 'center' : 'flex-start',
        backgroundColor: this.$screenBackgroundColor
      }}>
        {
          this.props.screenProps.hasPassedTheExam === false ?
          <NoPermissionToVisit
            module='储蓄情况'
            navigate={this.props.navigation.navigate}
          /> :
          <SectionList
            sections={this.state.savingsSituationsTypes}
            keyExtractor={(item) => item}
            renderItem={({item}) => <ListItem
              onPress={item.key === undefined ? () => {
                  if (item === '每月储蓄情况' || item === '历史储蓄情况' || item === '子女教育储蓄情况') {
                    this.props.navigation.navigate('SavingsSituations', {
                      title: item,
                      group: item === '历史储蓄情况' ? this.state.group : undefined
                    })
                  } else if (item === '同组成员储蓄情况') {
                    this.props.navigation.navigate('UserList', { title: item })
                  }
                } : undefined
              }
              itemIcon={item.key === '累计储蓄总额' && require('../assets/icons/Savings.png') ||
                item === '每月储蓄情况' && require('../assets/icons/ThisMonth.png') ||
                item === '历史储蓄情况' && require('../assets/icons/History.png') ||
                item === '同组成员储蓄情况' && require('../assets/icons/Friends.png') ||
                item === '子女教育储蓄情况' && require('../assets/icons/ChildrenEducation.png') ||
                undefined}
              itemKey={item.key || item}
              itemValue={item.key === '累计储蓄总额' ? item.value : undefined}
            />}
            renderSectionHeader={() => (
              <View style={{ height: this.$verticalSpacingDistance }}></View>
            )}
            ItemSeparatorComponent={ItemSeparatorComponent}
            refreshing={this.state.refreshing}
            onRefresh={this.props.screenProps.hasPassedTheExam === true ? () => this.getSavingsSituationsTypes(): undefined}
          />
        }
      </View>
    )
  }

  getSavingsSituationsTypes () {
    this.setState({ refreshing: true }, async () => {
      const [promise1, promise2] = await this.$JSONAjax.all([
        this.$JSONAjax({
          method: 'post',
          url: '/savingsSituation/getTotalSavings'
        }), this.$JSONAjax({
          method: 'post',
          url: '/savingsSituation/getSavingsSituationsTypes'
        })
      ])
  
      const response1 = promise1.data, response2 = promise2.data
  
      if (response1.statusCode === 100) {
        this.setState({
          savingsSituationsTypes: [
            {
              key: '0',
              data: [
                {
                  key: '累计储蓄总额',
                  value: response1.result.totalSavings
                }
              ]
            }
          ]
        })
      }
  
      if (response2.statusCode === 100) {
        this.setState({ group: response2.result.group }, () => this.setState({
          savingsSituationsTypes: this.state.savingsSituationsTypes.concat(this.state.group === 0 && [
            {
              key: '1',
              data: ['每月储蓄情况', '历史储蓄情况']
            },
            {
              key: '2',
              data: ['同组成员储蓄情况']
            }
          ] || this.state.group === 1 && [
            {
              key: '1',
              data: ['每月储蓄情况', '历史储蓄情况']
            },
            {
              key: '2',
              data: ['子女教育储蓄情况']
            }
          ] || this.state.group === 2 && [
            {
              key: '1',
              data: ['每月储蓄情况', '历史储蓄情况']
            },
            {
              key: '2',
              data: ['同组成员储蓄情况']
            },
            {
              key: '3',
              data: ['子女教育储蓄情况']
            }
          ] || this.state.group === 3 && [
            {
              key: '1',
              data: ['每月储蓄情况', '历史储蓄情况']
            }
          ] || [])
        }))
      }
  
      this.setState({ refreshing: false })
    })
  }
}
