'use strict'

import React from 'react'
import {
  ScrollView,
  Text,
  View
} from 'react-native'

import { verticalSpacingDistance, horizontalSpacingDistance } from '../libs/Styles'
import OS from '../libs/Platform'

export default function SystemNotification (props) {
  const { title, content, date } = props.navigation.state.params

  return (
    <ScrollView
      keyboardShouldPersistTaps='handled'
      alwaysBounceVertical={OS === 'ios' ? false : undefined} // ios
      contentContainerStyle={[
        { 
          flex: 1,
          paddingTop: verticalSpacingDistance,
          paddingBottom: verticalSpacingDistance,
          paddingLeft: horizontalSpacingDistance,
          paddingRight: horizontalSpacingDistance,
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
        marginTop: horizontalSpacingDistance
      }}>
        <Text style={{
          color: '#000'
        }}>{date}</Text>
      </View>
    </ScrollView>
  )
}
