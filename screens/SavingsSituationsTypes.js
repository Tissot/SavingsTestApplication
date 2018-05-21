'use strict'

import React, { PureComponent } from 'react'
import {
  View,
  SectionList
} from 'react-native'

import {
  NoPermissionToVisit,
  ListItem,
  ItemSeparatorComponent
} from '../components'

export default class SavingsSituationsTypes extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      refreshing: false,
      group: -1,
      savingsSituationsTypes: []
    }
  }

  componentDidMount () {
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
            navigate={this.props.navigation.navigate}
          /> :
          <SectionList
            sections={this.state.savingsSituationsTypes}
            keyExtractor={(item) => item}
            renderItem={({item}) => <ListItem
              onPress={item.key === undefined ? () => {
                  if (
                    item === this.$i18n.t('monthlySavingsSituations.title')
                    || item === this.$i18n.t('historicalSavingsSituations.title')
                    || item === this.$i18n.t('childrenEduSavingsSituations.title')
                  ) {
                    this.props.navigation.navigate('SavingsSituations', {
                      title: item,
                      group: item === this.$i18n.t('historicalSavingsSituations.title') ? this.state.group : undefined
                    })
                  } else if (item === this.$i18n.t('peerSavingsSituations.title')) {
                    this.props.navigation.navigate('UserList', { title: item })
                  }
                } : undefined
              }
              itemIcon={
                item.key === this.$i18n.t('savingsSituationsTypes.accumulatedSavings') && require('../assets/icons/Savings.png')
                || item === this.$i18n.t('monthlySavingsSituations.title') && require('../assets/icons/ThisMonth.png')
                || item === this.$i18n.t('historicalSavingsSituations.title') && require('../assets/icons/History.png')
                || item === this.$i18n.t('peerSavingsSituations.title') && require('../assets/icons/Friends.png')
                || item === this.$i18n.t('childrenEduSavingsSituations.title') && require('../assets/icons/ChildrenEducation.png')
                || undefined
              }
              itemKey={item.key || item}
              itemValue={item.key === this.$i18n.t('savingsSituationsTypes.accumulatedSavings') ? item.value : undefined}
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

  componentWillReceiveProps (nextProps) {
    this.refresh()
  }

  refresh (response) {
    let basicSavingsSituationsTypes = [
      {
        key: '0',
        data: [
          {
            key: this.$i18n.t('savingsSituationsTypes.accumulatedSavings'),
            value: response ? response.result.totalSavings : this.state.savingsSituationsTypes[0].data[0].value
          }
        ]
      },
      {
        key: '1',
        data: [
          this.$i18n.t('monthlySavingsSituations.title'),
          this.$i18n.t('historicalSavingsSituations.title')
        ]
      }
    ]

    let newSavingsSituationsTypes
    if (this.state.group === 0) {
      newSavingsSituationsTypes = [
        ...basicSavingsSituationsTypes,
        {
          key: '2',
          data: [this.$i18n.t('peerSavingsSituations.title')]
        }
      ]
    } else if (this.state.group === 1) {
      newSavingsSituationsTypes = [
        ...basicSavingsSituationsTypes,
        {
          key: '2',
          data: [this.$i18n.t('childrenEduSavingsSituations.title')]
        }
      ]
    } else if (this.state.group === 2) {
      newSavingsSituationsTypes = [
        ...basicSavingsSituationsTypes,
        {
          key: '2',
          data: [this.$i18n.t('peerSavingsSituations.title')]
        }, {
          key: '3',
          data: [this.$i18n.t('childrenEduSavingsSituations.title')]
        }
      ]
    } else if (this.state.group === 3) {
      newSavingsSituationsTypes = [...basicSavingsSituationsTypes]
    }

    this.setState({ savingsSituationsTypes: newSavingsSituationsTypes })
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
  
      const response1 = promise1.data
      const response2 = promise2.data
  
      if (response1.statusCode === 100 && response2.statusCode === 100) {
        this.setState({ group: response2.result.group }, () => this.refresh(response1))
      }
  
      this.setState({ refreshing: false })
    })
  }
}
