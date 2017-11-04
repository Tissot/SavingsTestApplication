'use strict'

import React, { Component } from 'react'
import {
  ScrollView,
  Text,
  View
} from 'react-native'

export default class SystemNotification extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    const { title, content, date } = this.props.navigation.state.params

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
        <Text style={{
          fontSize: 16,
          color: '#000'
        }}>{content}</Text>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          marginTop: this.$horizontalSpacingDistance
        }}>
          <Text style={{
            color: '#000'
          }}>{date}</Text>
        </View>
      </ScrollView>
    )
  }
}
